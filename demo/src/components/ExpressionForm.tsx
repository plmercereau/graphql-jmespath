import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import {
    Container,
    Textarea,
    Tabs,
    ActionIcon,
    Title,
    Blockquote,
    Alert
} from '@mantine/core'
import { Search, Refresh, AlertCircle } from 'tabler-icons-react'
import { GrGraphQl } from 'react-icons/gr'
import { VscJson } from 'react-icons/vsc'
import { FaChartBar } from 'react-icons/fa'
import { expressionToGraphQL, search } from 'graphql-jmespath'

import { request } from 'graphql-request'
import { Prism } from '@mantine/prism'
import { ChartResult } from './ChartResult'
import { Example } from 'src/examples'
import { Truncate } from './Truncate'

const API = 'https://countries.trevorblades.com/'

const Error: React.FC<{ error?: string; title: string }> = ({
    error,
    title
}) => {
    if (!error) return null
    return (
        <Alert icon={<AlertCircle size={16} />} title={title} color="red">
            {error}
        </Alert>
    )
}

export const ExpressionForm: React.FC<Example> = ({
    expression: initial,
    chart,
    title,
    description
}) => {
    const [firstRun, setFirstRun] = useState(true)
    const [input, setInput] = useState(initial)
    const [activeTab, setActiveTab] = useState(initial ? (chart ? 3 : 2) : 0)
    const [expression] = useDebouncedValue(input, 300)
    const [gqlQuery, setGqlQuery] = useState('')
    const [expressionError, setExpressionError] = useState('')
    const [graphqlError, setGraphqlError] = useState('')
    const [data, setData] = useState<any>()
    const [result, setResult] = useState<any>()
    const [jmesPathSearchError, setJmesPathSearchError] = useState('')

    const reset = () => {
        setInput('')
        setActiveTab(0)
        setGqlQuery('')
        setExpressionError('')
        setGraphqlError('')
        setData(undefined)
        setResult(undefined)
        setInput(initial)
        saveGraphQLQuery()
    }

    const saveGraphQLQuery = () => {
        try {
            const query = expressionToGraphQL(expression, { pretty: true })
            setGqlQuery(query)
            setExpressionError('')
        } catch (e: any) {
            setGqlQuery('')
            setActiveTab(0)
            setExpressionError(e.message)
        }
    }

    const fetch = async () => {
        setData(null)
        setGraphqlError('')
        setResult(null)
        setJmesPathSearchError('')
        try {
            const data = await request(API, gqlQuery)
            setData(data)
            try {
                const result = search(data, expression)
                setResult(result)
                if (!activeTab && !firstRun) {
                    setActiveTab(2)
                }
            } catch (e: any) {
                setActiveTab(2)
                setJmesPathSearchError(e.message)
            }
        } catch (e: any) {
            setActiveTab(1)
            setGraphqlError(e.message)
        }
    }

    useEffect(() => {
        if (expression) {
            setData(null)
            setExpressionError('')
            saveGraphQLQuery()
        }
    }, [expression])

    useEffect(() => {
        if (!!gqlQuery && firstRun) {
            fetch()
            setFirstRun(false)
        }
    }, [gqlQuery])

    return (
        <Container>
            <Title order={2}>{title}</Title>
            <Blockquote>{description}</Blockquote>
            <Textarea
                placeholder="JMESPath expression"
                minRows={2}
                autosize
                autoFocus
                onInput={() => {}}
                rightSection={
                    <>
                        <ActionIcon
                            onClick={reset}
                            style={{
                                position: 'absolute',
                                top: '0px',
                                margin: '4px'
                            }}
                        >
                            <Refresh />
                        </ActionIcon>
                        <ActionIcon
                            disabled={!!expressionError}
                            onClick={fetch}
                            style={{
                                position: 'absolute',
                                bottom: '0px',
                                margin: '4px'
                            }}
                        >
                            <Search />
                        </ActionIcon>
                    </>
                }
                value={input}
                onChange={(event) => {
                    if (event.target.value.trim() !== input.trim()) {
                        setActiveTab(0)
                    }
                    setInput(event.currentTarget.value)
                }}
            />
            <Tabs active={activeTab} onTabChange={setActiveTab} grow>
                <Tabs.Tab icon={<GrGraphQl color="#D91F8B" />} label="Query">
                    <Error title="Expression error" error={expressionError} />
                    {gqlQuery && <Prism language="graphql">{gqlQuery}</Prism>}
                </Tabs.Tab>
                <Tabs.Tab icon={<GrGraphQl color="#D91F8B" />} label="Result">
                    <Error title="GraphQL error" error={graphqlError} />
                    {data && (
                        <Truncate
                            value={JSON.stringify(data, null, 2)}
                            component={Prism}
                            language="json"
                        />
                    )}
                </Tabs.Tab>
                <Tabs.Tab icon={<VscJson />} label="JMESPath">
                    <Error
                        title="JMESPath search error"
                        error={jmesPathSearchError}
                    />
                    {result && (
                        <Truncate
                            value={JSON.stringify(result, null, 2)}
                            component={Prism}
                            language="json"
                        />
                    )}
                </Tabs.Tab>
                {chart && (
                    <Tabs.Tab icon={<FaChartBar />} label="Chart">
                        <ChartResult value={result} {...chart} />
                    </Tabs.Tab>
                )}
            </Tabs>
        </Container>
    )
}
