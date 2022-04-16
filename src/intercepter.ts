import { ASTNode, compile } from './jmespath'
import merge from 'deepmerge'
import { setProperty } from 'dot-prop'

type OperationResult = { value: any; path: string | undefined }
type OperationFunction = (node: ASTNode, path: string) => OperationResult

const Merge: OperationFunction = (node, path) => {
    const [left, right] = node.children
    const leftResult = recursiveJmespathToObject(left, path)
    const rightResult = recursiveJmespathToObject(right, path)
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

const Subexpression: OperationFunction = (node, path) => {
    const [right, left] = node.children
    const rightResult = recursiveJmespathToObject(right, path)
    const leftResult = recursiveJmespathToObject(left, path)
    if (rightResult.path) {
        const result = {
            value: {},
            path: joinPaths(rightResult.path, leftResult.path)
        }
        setProperty(result.value, rightResult.path, leftResult.value)
        return result
    } else {
        return { value: rightResult.value, path }
    }
}

const MultiSelect: OperationFunction = (node, path) => {
    let value = {}
    for (const child of node.children) {
        const res = recursiveJmespathToObject(child, path)
        value = merge(value, res.value)
    }
    return { value, path }
}

const recursiveJmespathToObject = (node: ASTNode, path: string = '') => {
    const operation = OPERATIONS[node.type]
    if (!operation) throw new Error('Unknown node type: ' + node.type)
    return operation(node, path)
}

export const jmespathToObject = (node: ASTNode) =>
    recursiveJmespathToObject(node).value

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
    Field: (node) => {
        return { value: { [node.name]: true }, path: node.name }
    },
    Subexpression,
    OrExpression: Merge,
    Comparator: Merge,
    AndExpression: Merge,
    FilterProjection: (node, path) => {
        const [first, second, third] = node.children
        const firstResult = recursiveJmespathToObject(first, path)
        const secondResult = recursiveJmespathToObject(second, path)
        const thirdResult = recursiveJmespathToObject(third, path)
        const value = firstResult.value
        if (firstResult.path) {
            setProperty(
                value,
                firstResult.path,
                merge(secondResult.value, thirdResult.value)
            )
        }
        return { path: joinPaths(firstResult.path, thirdResult.path), value }
    },
    Identity,
    Literal: Identity,
    Projection: (node, path) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path)
        const rightResult = recursiveJmespathToObject(right, path)
        const result = {
            value: leftResult.value,
            path: joinPaths(leftResult.path, rightResult.path)
        }
        // ! right.type !== 'Identity' is hacky, but it works so far in all the tests
        if (leftResult.path && right.type !== 'Identity') {
            setProperty(result.value, leftResult.path, rightResult.value)
        }
        return result
    },
    Flatten: (node, path) => {
        // const [first] = node.children
        // const firstResult = recursiveJmespathToObject(first, path)
        // const result = {
        //     value: firstResult.value,
        //     path: joinPaths(path, firstResult.path)
        // }
        //        // setProperty(result.value, result.path!, true)
        // return result
        return recursiveJmespathToObject(node.children[0], path)
    },
    IndexExpression: (node, path) => {
        return recursiveJmespathToObject(
            node.children[0],
            joinPaths(path, node.value)
        )
    },
    Pipe: Subexpression,
    MultiSelectList: MultiSelect,
    MultiSelectHash: MultiSelect,
    KeyValuePair: (node, path) => {
        return recursiveJmespathToObject(node.value, path)
    }
}

/*
      case 'Index':
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
      case 'ValueProjection':
        // Evaluate left child.
        base = this.visit(node.children[0], value)
        if (!isObject(base)) {
          return null
        }
        collected = []
        var values = objValues(base)
        for (i = 0; i < values.length; i++) {
          current = this.visit(node.children[1], values[i])
          if (current !== null) {
            collected.push(current)
          }
        }
        return collected
      case 'NotExpression':
        first = this.visit(node.children[0], value)
        return isFalse(first)
      case TOK_CURRENT:
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
// }
// }
