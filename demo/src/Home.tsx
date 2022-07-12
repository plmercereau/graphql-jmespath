import { request } from 'graphql-request'
import { Container } from '@mantine/core'

import { getIntrospectionSchema } from 'graphql-jmespath'
import { expressionToGraphQL } from 'graphql-jmespath'

const API = 'https://countries.trevorblades.com/'

getIntrospectionSchema(API).then((schema) => {
    const query = expressionToGraphQL('*[].{name:name}', {
        schema,
        pretty: true
    })
    request(API, query).then((res) => {
        console.log(res)
        // console.log(e.search(res))
    })
})

export const Home: React.FC = () => {
    return (
        <Container>
            <h2>Home</h2>
        </Container>
    )
}
