import { ASTNode, compile } from './jmespath'
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

export const jmespathToObject = (node: ASTNode) => {
    const result = recursiveJmespathToObject(node)
    return result.value
}

export const toGraphQL = (expression: string): any => {
    const node = compile(expression)
    console.log('Compiled', JSON.stringify(node, null, 2))
    // TODO convert object to graphql query
    return jmespathToObject(node)
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
            return {
                value: leftResult.value,
                path,
                wildcard: wildcard
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
            const result = {
                value: leftResult.value,
                path: `${leftResult.path}.${rightResult.path}`,
                wildcard
            }
            setProperty(result.value, leftResult.path, rightResult.value)
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
    NotExpression: FirstChild
}

/*    case 'Index':
        if (!isArray(value)) {
          return null
        }
        var index = node.value
        if (index < 0) {
          index = value.length + index
        }
        result = value[index]
        if (result === undefined) {
          result = null
        }
        return result
      case 'Slice':
        if (!isArray(value)) {
          return null
        }
        var sliceParams = node.children.slice(0)
        var computed = this.computeSliceParams(value.length, sliceParams)
        var start = computed[0]
        var stop = computed[1]
        var step = computed[2]
        result = []
        if (step > 0) {
          for (i = start; i < stop; i += step) {
            result.push(value[i])
          }
        } else {
          for (i = start; i > stop; i += step) {
            result.push(value[i])
          }
        }
        return result
      case Current:
        return value
        */
