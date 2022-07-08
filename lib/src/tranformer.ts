import { ASTNode, compile, search } from 'jmespath'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { recursiveJmespathToObject } from './compiler'
import { assertName, GraphQLFieldMap, GraphQLSchema } from 'graphql/type'
import { parse } from 'graphql'

type JsonObject = { [key: string]: JsonObject | boolean }

type UnknownFieldsOption = 'ignore' | 'raise'
type StopAtPathOption = ((path: string) => boolean) | string | string[]

type ArgumentValue = boolean | string | number | null | undefined

type GraphQLArguments = {
    [key: string]: GraphQLArguments | ArgumentValue | ArgumentValue[]
}

type Options = {
    schema?: GraphQLSchema
    stopAtPath?: StopAtPathOption
    rootQuery?: string
    rootArgs?: GraphQLArguments
    unknownFields?: UnknownFieldsOption
}

export class JMESPathGraphQL {
    readonly expression: string
    rootQuery?: string
    rootArgs?: GraphQLArguments
    stopAtPath: StopAtPathOption
    unknownFields: UnknownFieldsOption
    schema?: GraphQLSchema
    readonly ast: ASTNode

    constructor(
        expression: string,
        {
            schema,
            stopAtPath = [],
            rootQuery,
            rootArgs,
            unknownFields = 'ignore'
        }: Options = {}
    ) {
        this.expression = expression
        this.rootQuery = rootQuery
        this.rootArgs = rootArgs
        this.stopAtPath = stopAtPath
        this.unknownFields = unknownFields
        this.schema = schema
        this.ast = compile(expression)
    }

    toObject(): JsonObject | boolean {
        return recursiveJmespathToObject(this.ast).value
    }

    toJSON(options: Options = {}) {
        const { schema, stopAtPath, unknownFields, rootQuery, rootArgs } = {
            ...this,
            ...options
        }
        const json = filterObjectPaths(
            this.toObject(),
            { stopAtPath, unknownFields, schema },
            {
                // TODO differs when rootQuery is provided
                node: schema?.getQueryType()
            }
        )
        if (typeof json === 'boolean' || !Object.keys(json).length) {
            throw Error('Empty query')
        }
        const query = rootQuery
            ? {
                  [rootQuery]: { __args: rootArgs, ...json }
              }
            : json
        return { query }
    }

    toGraphQL(options: Options = {}) {
        // TODO option: validate against schema
        return parse(this.toString(options))
    }

    toString({
        pretty = false,
        ...options
    }: { pretty?: boolean } & Options = {}): string {
        const json = this.toJSON(options)
        return jsonToGraphQLQuery(json, { pretty })
    }

    search(obj: any) {
        return search(obj, this.expression)
    }
}

// ? move to class ?
// TODO (big): compile jmespath syntax such as filter, sort, etc into Hasura "_where", "_orderby", "_limit", "_offset"...
const filterObjectPaths = (
    obj: JsonObject | boolean,
    options: Required<Pick<Options, 'stopAtPath' | 'unknownFields'>> &
        Pick<Options, 'schema'>,
    {
        node,
        path = ''
    }: {
        node?: any // TODO type
        path?: string
    } = {}
): JsonObject | boolean => {
    // console.log('--------', path, node)
    const { stopAtPath, unknownFields, schema } = options
    if (schema) {
        // * When we have a schema, we only add parts of the graph that actually exist in the schema
        if (!node) {
            return false
        }

        // ! Ignore sub-obkect if one of its args is required
        if (
            node.args?.some(
                (arg: any) => arg.type.constructor.name === 'GraphQLNonNull'
            )
        ) {
            return false
        }
    }
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
        return true
    }

    let type = node?.type
    while (type && 'ofType' in type) {
        type = type.ofType
    }
    const childFields: GraphQLFieldMap<any, any> | undefined =
        node._fields || type._fields || undefined

    const objectResult = Object.entries(obj).reduce<JsonObject>(
        (aggr, [key, value]) => {
            let childType = childFields?.[key]?.type
            while (childType && 'ofType' in childType) {
                childType = childType.ofType
            }

            if (key === '*') {
                if (childFields) {
                    // TODO what happens when there is nothing to expand?
                    // * Expand wildcard fields from the GraphQL schema, when available
                    Object.entries(childFields).forEach(
                        ([childKey, childValue]) => {
                            const childObject = filterObjectPaths(
                                value,
                                options,
                                {
                                    path: path
                                        ? `${path}.${childKey}`
                                        : childKey,
                                    node: childValue
                                }
                            )
                            if (
                                childObject === true ||
                                Object.keys(childObject).length
                            ) {
                                // * Only add when the child object is not empty
                                aggr[childKey] = childObject
                            }
                        }
                    )
                } else {
                    // * The wildcard cannot be expanded: raise an error, or ignore it
                    if (unknownFields === 'raise') {
                        throw new Error(
                            `The expression contains wildcards than cannot be expanded at path: ${path}`
                        )
                    }
                }
                return aggr
            } else {
                // * Raise an error if the key is not a valid GraphQL name
                assertName(key)

                if (childFields && !node.name) {
                    // * The field is not defined in the GraphQL schema: raise an error, or ignore it
                    if (unknownFields === 'raise') {
                        throw new Error(
                            `The expression contains an unknown GraphQL field: ${key} at path: ${path}`
                        )
                    }
                } else {
                    const subObject = filterObjectPaths(value, options, {
                        node: childFields?.[key],
                        path: path ? `${path}.${key}` : key
                    })
                    if (subObject === true || Object.keys(subObject).length) {
                        // * Only add when the subObject is not empty
                        aggr[key] = subObject
                    }
                }
            }
            return aggr
        },
        {}
    )
    if (Object.keys(objectResult).length == 0) {
        // * Only return the object when it is not empty
        return false
    }
    return objectResult
}