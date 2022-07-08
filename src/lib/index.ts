import { ASTNode, compile } from 'jmespath'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { recursiveJmespathToObject } from './compiler'
import { assertName, GraphQLFieldMap, GraphQLSchema } from 'graphql/type'

type JsonObject = { [key: string]: JsonObject | boolean }

type WildcardsOption = 'ignore' | 'raise'
type StopAtPathOption = ((path: string) => boolean) | string | string[]

type ArgumentValue = boolean | string | number | null | undefined

type GraphQLArguments = {
    [key: string]: GraphQLArguments | ArgumentValue | ArgumentValue[]
}

type Options = {
    pretty?: boolean
    stopAtPath?: StopAtPathOption
    schema?: GraphQLSchema
    rootQuery?: string
    rootArgs?: GraphQLArguments
    unknownWildcards?: WildcardsOption
}

// TODO (big): compile jmespath syntax such as filter, sort, etc into Hasura "_where", "_orderby", "_limit", "_offset"...
const filterObjectPaths = (
    obj: JsonObject | boolean,
    {
        stopAtPath,
        unknownWildcards
    }: Required<Pick<Options, 'stopAtPath' | 'unknownWildcards'>>,
    {
        graphqlFields,
        path = ''
    }: { graphqlFields?: GraphQLFieldMap<any, any>; path?: string } = {}
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

    return Object.entries(obj).reduce<JsonObject>((aggr, [key, value]) => {
        let type = graphqlFields?.[key]?.type
        while (type && 'ofType' in type) {
            type = type.ofType
        }
        const childFields =
            type && 'getFields' in type ? type.getFields() : undefined
        console.log('Where are we???', key, type?.name, !!childFields)

        if (key === '*') {
            if (graphqlFields && childFields) {
                // * Expand wildcard fields from the GraphQL schema, when available
                Object.entries(childFields).forEach(
                    ([childKey, childValue]) => {
                        // TODO solve the following issue
                        // ? Maybe in testing that the graphql field name somehow equals the key?
                        /**
                         * For insance, *.name where * can be `propertyA` or `propertyB`:
                         * `propertyA.name` exists -> include
                         * `propertyB.name` does not exist -> ignore
                         */
                        let childType = childValue.type
                        while ('ofType' in childType) {
                            childType = childType.ofType
                        }
                        aggr[childKey] = filterObjectPaths(
                            value,
                            { stopAtPath, unknownWildcards },
                            {
                                path: path ? `${path}.${childKey}` : childKey,
                                graphqlFields:
                                    'getFields' in childType
                                        ? childType.getFields()
                                        : undefined
                            }
                        )
                    }
                )
                return aggr
            }

            // * Throw an error if the key is a wildcard
            if (unknownWildcards === 'raise') {
                throw new Error(
                    'The expression contains wildcards than cannot be expanded'
                )
            }
            // * Ignore wildcard fields
            return aggr
        }
        // * Raise an error if the key is not a valid GraphQL name
        assertName(key)

        if (!!graphqlFields && !!childFields) {
            // * the GraphQL field is a scalar, don't expand it
            aggr[key] = true
        }
        aggr[key] = filterObjectPaths(
            value,
            { stopAtPath, unknownWildcards },
            {
                path: path ? `${path}.${key}` : key,
                graphqlFields: childFields
            }
        )
        return aggr
    }, {})
}

export const objectToGraphQL = (
    obj: JsonObject,
    {
        pretty = false,
        stopAtPath = [],
        rootQuery,
        rootArgs,
        schema,
        unknownWildcards = 'ignore'
    }: Options = {}
): string => {
    const filteredObject = filterObjectPaths(
        obj,
        {
            stopAtPath,
            unknownWildcards
        },
        {
            // TODO differs when rootQuery is provided
            graphqlFields: schema?.getQueryType()?.getFields()
        }
    )
    if (
        typeof filteredObject === 'boolean' ||
        !Object.keys(filteredObject).length
    ) {
        throw Error('Empty query')
    }

    const query = rootQuery
        ? {
              [rootQuery]: { __args: rootArgs, ...filteredObject }
          }
        : filteredObject
    return jsonToGraphQLQuery({ query }, { pretty })
}

export const jmespathToObject = (expression: string) => {
    const ast = compile(expression)
    return astToObject(ast)
}

export const jmespathToGraphQL = (
    expression: string,
    options: Options = {}
) => {
    const obj = jmespathToObject(expression)
    return objectToGraphQL(obj, options)
}

export const astToObject = (node: ASTNode) =>
    recursiveJmespathToObject(node).value
