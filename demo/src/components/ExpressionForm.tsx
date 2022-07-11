import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import { Button, Container, TextInput } from '@mantine/core'
import { Expression } from 'graphql-jmespath'
import { Result } from './Result'

import { request } from 'graphql-request'
const API = 'https://countries.trevorblades.com/'

export const ExpressionForm: React.FC<{ initial: string }> = ({ initial }) => {
    const [input, setInput] = useState(initial)
    // TODO catch errors
    const [expression] = useDebouncedValue(new Expression(input), 200)
    const [data, setData] = useState()

    return (
        <Container>
            <TextInput
                placeholder="Expression"
                label="Full name"
                required
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
            />
            <Button
                onClick={() =>
                    request(API, expression.toGraphQL()).then((res) =>
                        setData(res)
                    )
                }
            >
                Fetch
            </Button>
            <Result expression={expression} data={data} />
        </Container>
    )
}
