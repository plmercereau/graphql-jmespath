import { ASTNode, compile } from 'jmespath'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import { recursiveJmespathToObject } from './compiler'

export const objectToGraphQL = (
    obj: any,
    { pretty = true }: { pretty?: boolean } = { pretty: true }
): string => {
    const query = {
        query: obj
    }
    // TODO throw error when obj cannot be used to build a GraphQL request:
    // TODO - empty object {}
    // TODO - not empty object but empty query after wildcard fields have been ignored
    return jsonToGraphQLQuery(query, { pretty, ignoreFields: ['*'] })
}

export const jmespathToGraphQL = (
    expression: string,
    { pretty = true }: { pretty?: boolean } = { pretty: true }
) => {
    const ast = compile(expression)
    const { value, wildcard } = astToObject(ast)
    if (wildcard) {
        console.log(`Expression "${expression}" contains wildcard(s) field(s)`)
    }
    return objectToGraphQL(value, { pretty })
}

export const astToObject = (node: ASTNode) => {
    const result = recursiveJmespathToObject(node)
    return { value: result.value, wildcard: result.wildcard }
}
