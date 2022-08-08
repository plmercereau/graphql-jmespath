import { ASTNode } from 'jmespath'
import merge from 'deepmerge'
import { setProperty, getProperty } from 'dot-prop'

export const recursiveJmespathToObject = (
    node: ASTNode,
    path: string = '',
    // TODO do we really need to keep track of wildcards in the compiler, now that it is tracked in the post ast->object compilation phase?
    wildcard = true
) => OPERATIONS[node.type](node, path, wildcard)

const joinPaths = (left?: string, right?: string) =>
    left && right ? `${left}.${right}` : left || right || ''

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
    value: any
): ObjectType {
    const oldValue: any = getProperty(object, path)
    const newValue = merge(oldValue, value)
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
            return rightResult
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
        // ? check wildcard in children
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
