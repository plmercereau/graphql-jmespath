import React, { useState } from 'react'
import {
    Alert,
    Blockquote,
    Button,
    Container,
    Drawer,
    Tabs,
    Textarea,
    Title,
    NavLink
} from '@mantine/core'
import chroma from 'chroma-js'
import { Example, examples } from './examples'

import { expressionToGraphQL, search } from 'graphql-jmespath'
import request from 'graphql-request'
import { Prism } from '@mantine/prism'
import { Cell, Pie, PieChart } from 'recharts'
import { IconAlertCircle } from '@tabler/icons'

export const Playground: React.FC = () => {
    const [backendUrl, setBackendUrl] = useState(
        'https://countries.trevorblades.com/'
    )
    const [expression, setExpression] = useState('')
    const [graphqlQuery, setGraphqlQuery] = useState('')
    const [graphqlData, setGraphqlData] = useState()
    const [error, setError] = useState('')
    const [jmesPathResult, setJmespathResult] = useState<any>()

    const [example, setExample] = useState<Example>()

    const loadExample = async (selectedExample: Example) => {
        setExample(selectedExample)
        setExpression(selectedExample.expression)
        await run(selectedExample.expression)
        setActiveTab(
            selectedExample.chart ? 'jmespath-chart' : 'jmespath-result'
        )
    }

    const [activeTab, setActiveTab] = useState<string | null>('graphql-query')

    const run = async (exp?: string) => {
        setError('')
        if (!exp) {
            setError('No expression')
            return
        }
        try {
            const query = expressionToGraphQL(exp, { pretty: true })
            if (query !== graphqlQuery) {
                setGraphqlQuery(query)
                try {
                    const gqlData = await request(backendUrl, query)
                    setGraphqlData(gqlData)
                    const jmesData = search(gqlData, exp)
                    setJmespathResult(jmesData)
                } catch (e: any) {
                    setError(e.response?.errors?.[0]?.message || e.message)
                    setGraphqlData(undefined)
                    setJmespathResult(undefined)
                }
            } else {
                const jmesData = search(graphqlData, exp)
                setJmespathResult(jmesData)
            }
        } catch (e) {
            const err = e as Error
            setError(err.message)
        }
    }

    const [examplesDrawerOpened, setExamplesDrawerOpened] = useState(false)
    return (
        <Container>
            <Title>Playground</Title>

            <Drawer
                opened={examplesDrawerOpened}
                onClose={() => setExamplesDrawerOpened(false)}
                title="Examples"
                padding="md"
                size="xl"
            >
                {examples.map((example) => (
                    <NavLink
                        key={example.expression}
                        onClick={() => {
                            setExamplesDrawerOpened(false)
                            loadExample(example)
                        }}
                        label={example.expression}
                        description={example.description}
                    />
                ))}
            </Drawer>
            <Button onClick={() => setExamplesDrawerOpened(true)}>
                Load an example
            </Button>

            {example && <Blockquote>{example.description}</Blockquote>}

            <Textarea
                placeholder="Expression"
                label="Expression"
                value={expression}
                rows={1}
                autosize
                onChange={(event) =>
                    setExpression(event.currentTarget.value.replace(/\n/g, ''))
                }
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        run(expression)
                    }
                }}
                style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
            />

            {error && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error"
                    color="red"
                >
                    {error}
                </Alert>
            )}

            <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="graphql-query">GraphQL Query</Tabs.Tab>
                    <Tabs.Tab value="graphql-data">GraphQL Data</Tabs.Tab>
                    <Tabs.Tab value="jmespath-result">JMESPath Result</Tabs.Tab>
                    {example?.chart && (
                        <Tabs.Tab value="jmespath-chart">
                            JMESPath Chart
                        </Tabs.Tab>
                    )}
                </Tabs.List>

                <Tabs.Panel value="graphql-query" pt="xs">
                    <Prism language="graphql">{graphqlQuery}</Prism>
                </Tabs.Panel>

                <Tabs.Panel value="graphql-data" pt="xs">
                    {graphqlData && (
                        <Prism language="json">
                            {JSON.stringify(graphqlData, null, 2)}
                        </Prism>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="jmespath-result" pt="xs">
                    {jmesPathResult && (
                        <Prism language="json">
                            {JSON.stringify(jmesPathResult, null, 2)}
                        </Prism>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="jmespath-chart" pt="xs">
                    {example?.chart &&
                        jmesPathResult &&
                        example.chart.type === 'pie' && (
                            <PieChart width={730} height={250}>
                                <Pie
                                    animationDuration={500}
                                    data={jmesPathResult}
                                    nameKey={example.chart.key}
                                    dataKey={example.chart.value}
                                    label={(entry) => entry.name}
                                >
                                    {jmesPathResult.map(
                                        (_: any, index: number) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    chroma
                                                        .scale([
                                                            '#fafa6e',
                                                            '#ff6d93'
                                                        ])
                                                        .mode('lch')
                                                        .colors(
                                                            jmesPathResult.length
                                                        )[index]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                            </PieChart>
                        )}
                </Tabs.Panel>
            </Tabs>
        </Container>
    )
}
