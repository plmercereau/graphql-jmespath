import { ASTNode, JmespathComparator } from 'jmespath'
import merge from 'deepmerge'
import { setProperty, getProperty } from 'dot-prop'
import { WhereArgumentPath } from './arguments'

export type CompilerOptions = {
    whereArgumentPath?: WhereArgumentPath
}

export const recursiveJmespathToObject: OperationFunction = (
    node,
    path,
    options
) => OPERATIONS[node.type](node, path, options)

const joinPaths = (left?: string, right?: string) =>
    left && right ? `${left}.${right}` : left || right || ''

type OperationResult = {
    value: any
    path: string
}

type OperationFunction = (
    node: ASTNode,
    path: string,
    options?: CompilerOptions
) => OperationResult

function mergeProperty<ObjectType extends Record<string, any>>(
    object: ObjectType,
    path: string,
    value: any
): ObjectType {
    const oldValue: any = getProperty(object, path)
    const newValue = merge(oldValue, value)
    return setProperty(object, path, newValue)
}

const Merge: OperationFunction = (node, ...rest) => {
    const [left, right] = node.children
    const leftResult = recursiveJmespathToObject(left, ...rest)
    const rightResult = recursiveJmespathToObject(right, ...rest)
    return {
        path: joinPaths(leftResult.path, rightResult.path),
        value: merge(leftResult.value, rightResult.value)
    }
}

const Identity: OperationFunction = (_, path) => {
    return {
        path,
        value: true
    }
}

const FirstChild: OperationFunction = (node, ...rest) =>
    recursiveJmespathToObject(node.children[0], ...rest)

const MultiSelect: OperationFunction = (node, path, options) => {
    let value = {}
    for (const child of node.children) {
        const res = recursiveJmespathToObject(child, path, options)
        value = merge(value, res.value)
    }
    return { value, path }
}

const OPERATIONS: Record<string, OperationFunction> = {
    // * Operations defined in JMESPath's abstract syntax, but not yet encountered in the tests: Index, Slice
    Field: (node) => {
        return { value: { [node.name]: true }, path: node.name }
    },
    Subexpression: (node, ...rest) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, ...rest)
        const rightResult = recursiveJmespathToObject(right, ...rest)
        if (leftResult.path) {
            const result = {
                value: {},
                path: joinPaths(leftResult.path, rightResult.path)
            }
            setProperty(result.value, leftResult.path, rightResult.value)
            return result
        } else {
            return rightResult
        }
    },
    OrExpression: (node, path, options) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, options)
        const rightResult = recursiveJmespathToObject(right, path, options)
        return {
            path,
            value: merge(leftResult.value, rightResult.value)
        }
    },
    Comparator: Merge,
    AndExpression: Merge,
    FilterProjection: (node, path, options) => {
        const [first, second, third] = node.children
        const firstResult = recursiveJmespathToObject(first, path, options)
        const secondResult = recursiveJmespathToObject(second, path, options)
        const thirdResult = recursiveJmespathToObject(third, path, options)
        const value = firstResult.value
        if (firstResult.path) {
            setProperty(
                value,
                firstResult.path,
                merge(secondResult.value, thirdResult.value)
            )
            const whereArgumentPath = options?.whereArgumentPath
            const [left, right] = third.children
            if (
                whereArgumentPath &&
                third.type === 'Comparator' &&
                right.type === 'Literal'
            ) {
                if (Array.isArray(right.value)) {
                    // TODO handle this case
                    console.error('Litteral is an array', JSON.stringify({comparator: third.name, left, right}, null, 2))
                    throw Error('Litteral is an array')
                }
                    setProperty(
                        value,
                        whereArgumentPath(
                            firstResult.path,
                            left.name,
                            third.name as JmespathComparator
                        ),
                        right.value
                    )
                
            }
        }
        return {
            path: firstResult.path,
            value
        }
    },
    Identity,
    Literal: Identity,
    Projection: (node, ...rest) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, ...rest)
        const rightResult = recursiveJmespathToObject(right, ...rest)
        const result = {
            value: leftResult.value,
            path: joinPaths(leftResult.path, rightResult.path)
        }
        // ! right.type !== 'Identity' is hacky, but it works so far in all the tests
        if (leftResult.path && right.type !== 'Identity') {
            mergeProperty(result.value, leftResult.path, rightResult.value)
        }
        return result
    },
    Flatten: FirstChild,
    IndexExpression: FirstChild,
    Pipe: (node, path, options) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, options)
        const rightResult = recursiveJmespathToObject(right, path, options)
        if (rightResult.path && leftResult.path) {
            const newPath = `${leftResult.path}.${rightResult.path}`
            const result = {
                value: leftResult.value,
                path: newPath
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
                        options
                    ).path
                    setProperty(value, realPath, rightValue)
                }
            }
            return { value, path: '' }
        } else if (left.type === 'OrExpression') {
            // * 'foo.bam || bar | baz'
            const value = {}
            for (const leftChild of left.children) {
                const realPath = recursiveJmespathToObject(
                    leftChild,
                    path,
                    options
                ).path
                setProperty(value, realPath, rightResult.value)
            }
            return {
                value,
                path
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
                path
            }
        }
    },
    MultiSelectList: MultiSelect,
    MultiSelectHash: MultiSelect,
    KeyValuePair: (node, ...rest) => {
        return recursiveJmespathToObject(node.value, ...rest)
    },
    ValueProjection: (node, ...rest) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, ...rest)
        const rightResult = recursiveJmespathToObject(right, ...rest)
        const newPath = joinPaths(leftResult.path, '*')
        const value = {}
        setProperty(value, newPath, rightResult.value)
        return {
            value,
            path: joinPaths(newPath, rightResult.path)
        }
    },
    Function: (node, ...rest) => {
        let root = {}
        let rootPath = ''
        let children = {}
        for (const child of node.children) {
            const result = recursiveJmespathToObject(child, ...rest)
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
        return { value: root, path: rootPath }
    },
    ExpressionReference: FirstChild,
    NotExpression: FirstChild,
    Current: (_, path) => {
        return { value: {}, path }
    }
}
