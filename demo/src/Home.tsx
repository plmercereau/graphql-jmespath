import { request } from 'graphql-request'
import { useState } from 'react'
import { Container } from '@mantine/core'

import { Expression, getIntrospectionSchema } from 'graphql-jmespath'

const API = 'https://countries.trevorblades.com/'

getIntrospectionSchema(API).then((schema) => {
    const e = new Expression('*[].{name:name}', { schema })
    const query = e.toGraphQL({ pretty: true })
    request(API, query).then((res) => {
        console.log(res)
        console.log(e.search(res))
    })
})

export const Home: React.FC = () => {
    return (
        <Container>
            <h2>Home</h2>
        </Container>
    )
}
