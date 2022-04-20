import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { ASTNode, compile } from 'jmespath'
import merge from 'deepmerge'
import { setProperty, getProperty } from 'dot-prop'

type OperationResult = {
    value: any
    path: string
    wildcard: boolean
}
type OperationFunction = (
    node: ASTNode,
    path: string,
    wildcard: boolean
) => OperationResult

function mergeProperty<ObjectType extends Record<string, any>>(
    object: ObjectType,
    path: string,
    value: unknown
): ObjectType {
    const oldValue: any = getProperty(object, path)
    const newValue = merge(oldValue, value as any)
    return setProperty(object, path, newValue)
}

const Merge: OperationFunction = (node, path, wc) => {
    const [left, right] = node.children
    const leftResult = recursiveJmespathToObject(left, path, wc)
    const rightResult = recursiveJmespathToObject(right, path, wc)
    const wildcard = wc || leftResult.wildcard || rightResult.wildcard
    return {
        path: joinPaths(leftResult.path, rightResult.path),
        value: merge(leftResult.value, rightResult.value),
        wildcard
    }
}

const Identity: OperationFunction = (_, path, wildcard) => {
    return {
        path,
        value: true,
        wildcard
    }
}

const FirstChild: OperationFunction = (node, path, wildcard) =>
    recursiveJmespathToObject(node.children[0], path, wildcard)

const MultiSelect: OperationFunction = (node, path, wc) => {
    let value = {}
    let wildcard = wc
    for (const child of node.children) {
        const res = recursiveJmespathToObject(child, path, wc)
        value = merge(value, res.value)
        wildcard = wildcard || res.wildcard
    }
    return { value, path, wildcard }
}

const recursiveJmespathToObject = (
    node: ASTNode,
    path: string = '',
    wildcard = false
) => {
    const operation = OPERATIONS[node.type]
    if (!operation) throw new Error('Unknown node type: ' + node.type)
    return operation(node, path, wildcard)
}

export const astToObject = (node: ASTNode) => {
    const result = recursiveJmespathToObject(node)
    return { value: result.value, wildcard: result.wildcard }
}

export const objectToGraphQL = (
    obj: any,
    { pretty = true }: { pretty?: boolean } = { pretty: true }
): string => {
    const query = {
        query: obj
    }
    // TODO throw error when obj cannot be used to build a GraphQL request:
    // TODO - empty object {}
    // TODO - not empty object but empty query after wildcard fields have been ignored
    return jsonToGraphQLQuery(query, { pretty, ignoreFields: ['*'] })
}

export const jmespathToGraphQL = (
    expression: string,
    { pretty = true }: { pretty?: boolean } = { pretty: true }
) => {
    const ast = compile(expression)
    const { value, wildcard } = astToObject(ast)
    if (wildcard) {
        console.log(`Expression "${expression}" contains wildcard(s) field(s)`)
    }
    return objectToGraphQL(value, { pretty })
}

const joinPaths = (a: string | undefined, b: string | undefined) => {
    if (a) {
        if (b) return a + '.' + b
        else return a
    } else {
        if (b) return b
        else return ''
    }
}

const OPERATIONS: Record<string, OperationFunction> = {
    // * Operations defined in JMESPath's abstract syntax, but not yet encountered in the tests: Index, Slice
    Field: (node, _, wildcard) => {
        return { value: { [node.name]: true }, path: node.name, wildcard }
    },
    Subexpression: (node, path, wc) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, wc)
        const rightResult = recursiveJmespathToObject(right, path, wc)
        const wildcard = wc || leftResult.wildcard || rightResult.wildcard
        if (leftResult.path) {
            const result = {
                value: {},
                path: joinPaths(leftResult.path, rightResult.path),
                wildcard
            }
            setProperty(result.value, leftResult.path, rightResult.value)
            return result
        } else {
            if (Object.keys(leftResult.value).length === 0) {
                // * left type is 'Current' ('@')
                return rightResult
            } else {
                return {
                    value: leftResult.value,
                    path,
                    wildcard
                }
            }
        }
    },
    OrExpression: (node, path, wc) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, wc)
        const rightResult = recursiveJmespathToObject(right, path, wc)
        const wildcard = wc || leftResult.wildcard || rightResult.wildcard
        return {
            path,
            value: merge(leftResult.value, rightResult.value),
            wildcard
        }
    },
    Comparator: Merge,
    AndExpression: Merge,
    FilterProjection: (node, path, wc) => {
        const [first, second, third] = node.children
        const firstResult = recursiveJmespathToObject(first, path, wc)
        const secondResult = recursiveJmespathToObject(second, path, wc)
        const thirdResult = recursiveJmespathToObject(third, path, wc)
        const wildcard =
            wc ||
            firstResult.wildcard ||
            secondResult.wildcard ||
            thirdResult.wildcard
        const value = firstResult.value
        if (firstResult.path) {
            setProperty(
                value,
                firstResult.path,
                merge(secondResult.value, thirdResult.value)
            )
        } else {
            // console.warn('something unhandled')
        }
        return {
            path: firstResult.path,
            value,
            wildcard
        }
    },
    Identity,
    Literal: Identity,
    Projection: (node, path, wc) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, wc)
        const rightResult = recursiveJmespathToObject(right, path, wc)
        const wildcard = wc || leftResult.wildcard || rightResult.wildcard
        const result = {
            value: leftResult.value,
            path: joinPaths(leftResult.path, rightResult.path),
            wildcard
        }
        // ! right.type !== 'Identity' is hacky, but it works so far in all the tests
        if (leftResult.path && right.type !== 'Identity') {
            mergeProperty(result.value, leftResult.path, rightResult.value)
        } else {
            // console.log('handle this case?', left.type, right.type)
        }
        return result
    },
    Flatten: FirstChild,
    IndexExpression: FirstChild,
    Pipe: (node, path, wc) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, wc)
        const rightResult = recursiveJmespathToObject(right, path, wc)
        const wildcard = wc || leftResult.wildcard || rightResult.wildcard
        if (rightResult.path && leftResult.path) {
            const newPath = `${leftResult.path}.${rightResult.path}`
            const result = {
                value: leftResult.value,
                path: newPath,
                wildcard
            }
            if (!getProperty(leftResult.value, newPath)) {
                // * Only expressions like 'foo | bar' but not like 'people[?general.id==`100`] | [0].general'
                setProperty(result.value, leftResult.path, rightResult.value)
            }

            return result
        } else if (left.type === 'MultiSelectHash') {
            // * '{"x": foo, "y": bar} | [y.baz]'
            const value = {}
            for (const leftChild of left.children) {
                const rightValue =
                    rightResult.value['*'] || rightResult.value[leftChild.name]
                if (rightValue) {
                    const realPath = recursiveJmespathToObject(
                        leftChild,
                        path,
                        wc
                    ).path
                    setProperty(value, realPath, rightValue)
                }
            }
            return { value, path: '', wildcard }
        } else if (left.type === 'OrExpression') {
            // * 'foo.bam || bar | baz'
            const value = {}
            for (const leftChild of left.children) {
                const realPath = recursiveJmespathToObject(
                    leftChild,
                    path,
                    wc
                ).path
                setProperty(value, realPath, rightResult.value)
            }
            return {
                value,
                path,
                wildcard: wildcard
            }
        } else {
            // * 'foo | other || bar'
            if (right.type === 'OrExpression') {
                setProperty(
                    leftResult.value,
                    leftResult.path,
                    rightResult.value
                )
            }
            return {
                value: leftResult.value,
                path,
                wildcard: wildcard
            }
        }
    },
    MultiSelectList: MultiSelect,
    MultiSelectHash: MultiSelect,
    KeyValuePair: (node, path, wildcard) => {
        return recursiveJmespathToObject(node.value, path, wildcard)
    },
    ValueProjection: (node, path, wc) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, wc)
        const rightResult = recursiveJmespathToObject(right, path, wc)
        const newPath = joinPaths(leftResult.path, '*')
        const value = {}
        setProperty(value, newPath, rightResult.value)
        return {
            value,
            path: joinPaths(newPath, rightResult.path),
            wildcard: true
        }
    },
    Function: (node, path, wc) => {
        // TODO check wildcard in children
        let root = {}
        let rootPath = ''
        let children = {}
        for (const child of node.children) {
            const result = recursiveJmespathToObject(child, path, wc)
            if (child.type === 'ExpressionReference') {
                children = merge(children, result.value)
            } else if (child.type !== 'Literal') {
                // * Skip literals
                root = merge(root, result.value)
                rootPath = result.path || ''
            }
        }
        if (rootPath && Object.keys(children).length) {
            setProperty(root, rootPath, children)
        }
        return { value: root, path: rootPath, wildcard: wc }
    },
    ExpressionReference: FirstChild,
    NotExpression: FirstChild,
    Current: (_, path, wildcard) => {
        return { value: {}, path, wildcard }
    }
}
