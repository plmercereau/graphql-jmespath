import { ASTNode, compile } from './jmespath'
import merge from 'deepmerge'
import { setProperty } from 'dot-prop'

type OperationResult = { value: any; path: string }
type OperationFunction = (node: ASTNode, path: string) => OperationResult

const mergeOperation: OperationFunction = (node, path) => {
    const [left, right] = node.children
    const leftResult = recursiveJmespathToObject(left, path)
    const rightResult = recursiveJmespathToObject(right, path)
    return { path, value: merge(leftResult.value, rightResult.value) }
}

const identityOperation: OperationFunction = (_, path) => ({
    path,
    value: true
})

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

const OPERATIONS: Record<string, OperationFunction> = {
    Field: (node) => {
        return { value: { [node.name]: true }, path: node.name }
    },
    Subexpression: (node, path) => {
        const [right, left] = node.children
        const rightResult = recursiveJmespathToObject(right, path)
        const leftResult = recursiveJmespathToObject(left, path)
        const result = {
            value: {},
            path: (rightResult.path && rightResult.path + '.') + leftResult.path
        }
        setProperty(result.value, rightResult.path, leftResult.value)
        return result
    },
    OrExpression: mergeOperation,
    Comparator: mergeOperation,
    AndExpression: mergeOperation,
    FilterProjection: (node, path) => {
        // TODO test with nested filters (check if path is correctly passed)
        const [first, _, third] = node.children
        const firstResult = recursiveJmespathToObject(first, path)
        const thirdResult = recursiveJmespathToObject(third, path)
        const value = firstResult.value
        setProperty(value, firstResult.path, thirdResult.value)
        return { path, value }
    },
    Identity: identityOperation,
    Literal: identityOperation,
    Projection: (node, path) => {
        const [left, right] = node.children
        const leftResult = recursiveJmespathToObject(left, path)
        const rightResult = recursiveJmespathToObject(right, path)
        const result = {
            value: {},
            path: (rightResult.path && rightResult.path + '.') + leftResult.path
        }
        setProperty(result.value, leftResult.path, rightResult.value)
        return result
    },
    Flatten: (node, path) => {
        const [first] = node.children
        return recursiveJmespathToObject(
            first,
            (path && path + '.') + first.name
        )
    }
}

// graphqlVisit(node: ASTNode, path: string): OperationResult {
//     const operation = OPERATIONS[node.type]
//     if (!operation) throw new Error('Unknown node type: ' + node.type)
//     return operation(this, node, path)

/*
      case 'IndexExpression':
        left = this.visit(node.children[0], value)
        right = this.visit(node.children[1], left)
        return right
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
      case 'Projection':
        // Evaluate left child.
        var base = this.visit(node.children[0], value)
        if (!isArray(base)) {
          return null
        }
        collected = []
        for (i = 0; i < base.length; i++) {
          current = this.visit(node.children[1], base[i])
          if (current !== null) {
            collected.push(current)
          }
        }
        return collected
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
      case 'FilterProjection':
        base = this.visit(node.children[0], value)
        if (!isArray(base)) {
          return null
        }
        var filtered = []
        var finalResults = []
        for (i = 0; i < base.length; i++) {
          matched = this.visit(node.children[2], base[i])
          if (!isFalse(matched)) {
            filtered.push(base[i])
          }
        }
        for (var j = 0; j < filtered.length; j++) {
          current = this.visit(node.children[1], filtered[j])
          if (current !== null) {
            finalResults.push(current)
          }
        }
        return finalResults
      case 'Comparator':
        first = this.visit(node.children[0], value)
        second = this.visit(node.children[1], value)
        switch (node.name) {
          case TOK_EQ:
            result = strictDeepEqual(first, second)
            break
          case TOK_NE:
            result = !strictDeepEqual(first, second)
            break
          case TOK_GT:
            result = first > second
            break
          case TOK_GTE:
            result = first >= second
            break
          case TOK_LT:
            result = first < second
            break
          case TOK_LTE:
            result = first <= second
            break
          default:
            throw new Error('Unknown comparator: ' + node.name)
        }
        return result
      case TOK_FLATTEN:
        var original = this.visit(node.children[0], value)
        if (!isArray(original)) {
          return null
        }
        var merged = []
        for (i = 0; i < original.length; i++) {
          current = original[i]
          if (isArray(current)) {
            merged.push.apply(merged, current)
          } else {
            merged.push(current)
          }
        }
        return merged
      case 'Identity':
        return value
      case 'MultiSelectList':
        if (value === null) {
          return null
        }
        collected = []
        for (i = 0; i < node.children.length; i++) {
          collected.push(this.visit(node.children[i], value))
        }
        return collected
      case 'MultiSelectHash':
        if (value === null) {
          return null
        }
        collected = {}
        var child
        for (i = 0; i < node.children.length; i++) {
          child = node.children[i]
          collected[child.name] = this.visit(child.value, value)
        }
        return collected
      case 'OrExpression':
        matched = this.visit(node.children[0], value)
        if (isFalse(matched)) {
          matched = this.visit(node.children[1], value)
        }
        return matched
      case 'AndExpression':
        first = this.visit(node.children[0], value)

        if (isFalse(first) === true) {
          return first
        }
        return this.visit(node.children[1], value)
      case 'NotExpression':
        first = this.visit(node.children[0], value)
        return isFalse(first)
      case 'Literal':
        return node.value
      case TOK_PIPE:
        left = this.visit(node.children[0], value)
        return this.visit(node.children[1], left)
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
