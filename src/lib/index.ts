import { ASTNode, compile } from 'jmespath'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { recursiveJmespathToObject } from './compiler'
import { assertName } from 'graphql/type'

type JsonObject = { [key: string]: JsonObject | boolean }

type StopAtPathOption = ((path: string) => boolean) | string | string[]

type Options = {
    pretty?: boolean
    stopAtPath?: StopAtPathOption
}

const filterObjectPaths = (
    obj: JsonObject | boolean,
    stopAtPath: StopAtPathOption,
    path = ''
): JsonObject | boolean => {
    // * We reached a leaf node, so we return the boolean value
    if (typeof obj === 'boolean') {
        return obj
    }

    // * stopAtPath: stop browsing further down the tree
    if (
        (typeof stopAtPath === 'function' && stopAtPath(path)) ||
        (typeof stopAtPath === 'string' && path === stopAtPath) ||
        (Array.isArray(stopAtPath) && stopAtPath.includes(path))
    ) {
        // TODO: at a later point, we could also detect a stop if we hit a litteral value in the GraphQL schema e.g. a JSON field
        return true
    }

    return (
        Object.entries(obj)
            // * Ignore wildcard fields
            // TODO: raise an error if there is a wildcard
            // TODO: at a later point, we should enable the option to expand wildcard fields from the GraphQL schema, when available
            .filter(([key]) => key !== '*')
            .reduce<JsonObject>((aggr, [key, value]) => {
                // * Raise an error if the key is not a valid GraphQL name
                assertName(key)
                aggr[key] = filterObjectPaths(
                    value,
                    stopAtPath,
                    path ? `${path}.${key}` : key
                )
                return aggr
            }, {})
    )
}

export const objectToGraphQL = (
    obj: JsonObject,
    { pretty = true, stopAtPath = [] }: Options = {}
): string => {
    const query = filterObjectPaths(obj, stopAtPath)
    if (Object.keys(query).length === 0) {
        throw Error('Empty query')
    }
    return jsonToGraphQLQuery({ query }, { pretty })
}

export const jmespathToObject = (expression: string, options: Options = {}) => {
    const ast = compile(expression)
    return astToObject(ast)
}

export const jmespathToGraphQL = (
    expression: string,
    options: Options = {}
) => {
    const obj = jmespathToObject(expression, options)
    return objectToGraphQL(obj, options)
}

export const astToObject = (node: ASTNode) =>
    recursiveJmespathToObject(node).value
