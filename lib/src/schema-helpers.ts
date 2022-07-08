import { request } from 'graphql-request'
import { buildClientSchema, getIntrospectionQuery } from 'graphql'

export const getIntrospectionSchema = async (endpoint: string) => {
    const res = await request(
        endpoint,
        getIntrospectionQuery({ descriptions: false })
    )
    return buildClientSchema(res, { assumeValid: true })
}
