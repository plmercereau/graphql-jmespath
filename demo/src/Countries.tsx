import { request } from 'graphql-request'
import { useState } from 'react'
import { Button, Container } from '@mantine/core'

import { Expression } from 'graphql-jmespath'
import { Result } from './components/Result'

const expression =
    "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

const exp = new Expression(expression)
const API = 'https://countries.trevorblades.com/'

export const Countries: React.FC = () => {
    const [data, setData] = useState()
    return (
        <Container>
            <h1>Countries</h1>
            <h2>{expression}</h2>
            <Button
                onClick={() =>
                    request(API, exp.toGraphQL()).then((res) => setData(res))
                }
            >
                Fetch
            </Button>
            <Result expression={exp} data={data} />
        </Container>
    )
}
