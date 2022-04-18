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

const Subexpression: OperationFunction = (node, path, wc) => {
    const [right, left] = node.children
    const leftResult = recursiveJmespathToObject(left, path, wc)
    const rightResult = recursiveJmespathToObject(right, path, wc)
    const wildcard = wc || leftResult.wildcard || rightResult.wildcard
    if (rightResult.path) {
        const result = {
            value: {},
            path: joinPaths(rightResult.path, leftResult.path),
            wildcard
        }
        setProperty(result.value, rightResult.path, leftResult.value)
        return result
    } else {
        return {
            value: rightResult.value,
            path,
            wildcard: wildcard
        }
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
    Subexpression,
    OrExpression: Merge,
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
        // const [first] = node.children
        // const firstResult = recursiveJmespathToObject(first, path)
        // const result = {
        //     value: firstResult.value,
        //     path: joinPaths(path, firstResult.path)
        // }
        //        // setProperty(result.value, result.path!, true)
        // return result
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
        console.log('Pipe')
        const [right, left] = node.children
        const leftResult = recursiveJmespathToObject(left, path, wc)
        const rightResult = recursiveJmespathToObject(right, path, wc)
        const wildcard = wc || leftResult.wildcard || rightResult.wildcard
        console.log('Pipe::::', { leftResult, rightResult })
        if (rightResult.path) {
            console.log(
                'rightResult.path!!!!',
                joinPaths(rightResult.path, leftResult.path)
            )
            const result = {
                value: rightResult.value,
                path: joinPaths(rightResult.path, leftResult.path),
                wildcard
            }
            // setProperty(result.value, rightResult.path, rightResult.value)
            return result
        } else {
            return {
                value: rightResult.value,
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
