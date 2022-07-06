import { ASTNode, compile } from 'jmespath'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { recursiveJmespathToObject } from './compiler'
import { JsonObject } from './types'

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
    // TODO filter invalid keys (see the first expressions in the tests)
    if (typeof obj === 'boolean') {
        return obj
    }
    if (typeof stopAtPath === 'function' && stopAtPath(path)) {
        return true
    }
    if (typeof stopAtPath === 'string' && path === stopAtPath) {
        return true
    }
    if (Array.isArray(stopAtPath) && stopAtPath.includes(path)) {
        return true
    }

    return Object.entries(obj).reduce<JsonObject>((aggr, [key, value]) => {
        aggr[key] = filterObjectPaths(
            value,
            stopAtPath,
            path ? `${path}.${key}` : key
        )
        return aggr
    }, {})
}

export const objectToGraphQL = (
    obj: JsonObject,
    { pretty = true, stopAtPath = [] }: Options = {}
): string =>
    // TODO throw error when obj cannot be used to build a GraphQL request:
    // TODO - empty object {}
    // TODO - not empty object but empty query after wildcard fields have been ignored
    jsonToGraphQLQuery(
        {
            query: filterObjectPaths(obj, stopAtPath)
        },
        { pretty, ignoreFields: ['*'] }
    )

export const jmespathToGraphQL = (
    expression: string,
    options: Options = {}
) => {
    const ast = compile(expression)
    const { value, wildcard } = astToObject(ast)
    if (wildcard) {
        // TODO what to do with wildcard?
        console.log(`Expression "${expression}" contains wildcard(s) field(s)`)
    }
    return objectToGraphQL(value, options)
}

export const astToObject = (
    node: ASTNode
): { value: JsonObject; wildcard: boolean } => {
    const { value, wildcard } = recursiveJmespathToObject(node)
    return { value, wildcard }
}
