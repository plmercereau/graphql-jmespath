import { ASTNode, compile } from './jmespath'
import merge from 'deepmerge'
import { setProperty } from 'dot-prop'

type OperationResult = {
    value: any
    path: string | undefined
    wildcard: boolean
}
type OperationFunction = (
    node: ASTNode,
    path: string,
    wildcard: boolean
) => OperationResult

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
        else return undefined
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
            console.warn('todo')
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
            console.warn('something unhandled')
        }
        return {
            // ? path: joinPaths(firstResult.path, thirdResult.path),
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
            setProperty(result.value, leftResult.path, rightResult.value)
        } else {
            console.log('handle this case?')
        }
        return result
    },
    Flatten: (node, path, wildcard) => {
        return recursiveJmespathToObject(node.children[0], path, wildcard)
    },
    IndexExpression: (node, path, wildcard) => {
        return recursiveJmespathToObject(
            node.children[0],
            joinPaths(path, node.value),
            wildcard
        )
    },
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
        } else {
            if (left.type === 'MultiSelectHash') {
                // * '{"x": foo, "y": bar} | [y.baz]'
                const value = {}
                for (const leftChild of left.children) {
                    const rightChild = rightResult.value[leftChild.name]
                    if (rightChild) {
                        const realPath = recursiveJmespathToObject(
                            leftChild,
                            path,
                            wc
                        ).path
                        setProperty(value, realPath as string, rightChild)
                    }
                }
                return { value, path: '', wildcard }
            } else if (left.type === 'OrExpression') {
                // TODO 'foo.bam || foo.bar | baz'
                console.log('here', { leftResult, rightResult })
                return {
                    value: leftResult.value,
                    path,
                    wildcard: wildcard
                }
            } else {
                return {
                    value: leftResult.value,
                    path,
                    wildcard: wildcard
                }
            }
        }
    },
    MultiSelectList: MultiSelect,
    MultiSelectHash: MultiSelect,
    KeyValuePair: (node, path, wildcard) => {
        const result = recursiveJmespathToObject(node.value, path, wildcard)
        return result
    },
    ValueProjection: (node, path, wc) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path, wc)
        const rightResult = recursiveJmespathToObject(right, path, wc)
        const value = leftResult.value
        setProperty(value, `${leftResult.path}.*`, rightResult.value)
        return {
            value,
            path: joinPaths(`${leftResult.path}.*`, rightResult.path),
            wildcard: true
        }
    }
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
      case 'NotExpression':
        first = this.visit(node.children[0], value)
        return isFalse(first)
      case Current:
        return value
      case 'Function':
        var resolvedArgs = []
        for (i = 0; i < node.children.length; i++) {
          resolvedArgs.push(this.visit(node.children[i], value))
        }
        return this.runtime.callFunction(node.name, resolvedArgs)
      case 'ExpressionReference':
        var refNode = node.children[0]
        // Tag the node with a specific attribute so the type
        // checker verify the type.
        refNode.jmespathType = TOK_EXPREF
        return refNode
        */
