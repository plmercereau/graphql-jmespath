import { request } from 'graphql-request'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'

export const getIntrospectionSchema = async (endpoint: string) => {
    const res = await request(
        endpoint,
        getIntrospectionQuery({ descriptions: false })
    )
    const schema = buildClientSchema(res)
    console.log(schema)
    console.log(schema.getQueryType()?.getFields().continents.type)
    return schema
}
