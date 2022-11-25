<template>
    <q-card>
        <q-card-section>
            <q-btn color="primary" label="Load an example">
                <q-menu>
                    <q-list style="min-width: 100px">
                        <q-item clickable v-close-popup v-for="example in examples"
                            @click="() => loadExample(example)">
                            <q-item-section>{{ example.expression }}</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
        </q-card-section>
        <q-card-section v-if="example">
            {{ example.description }}
        </q-card-section>
        <q-card-section>
            <q-form @submit="run">
                <q-input v-model="expression" label="Expression">
                    <template v-slot:append>
                        <q-btn round dense flat icon="send" @click="run" :disable="!expression" />
                    </template>
                </q-input>
            </q-form>
            <!-- TODO improve the error section -->
            <div v-if="error">
                {{ error }}
            </div>
        </q-card-section>
        <q-card-section>
            <q-tabs v-model="activeTab" dense active-color="primary" indicator-color="primary" align="justify"
                inline-label>
                <q-tab name="graphql-query" icon="mdi-graphql" col label="GraphQL Query" />
                <q-tab name="graphql-data" icon="mdi-graphql" label="GraphQL Result" />
                <q-tab name="jmespath-result" icon="mdi-code-json" label="JMESPath Result" />
                <q-tab name="jmespath-chart" icon="mdi-chart-line" label="JMESPath Chart" v-if="example?.chart" />
            </q-tabs>
            <q-separator />

            <q-tab-panels v-model="activeTab" animated>
                <q-tab-panel name="graphql-query">
                    <Code language="graphql" :value="graphqlQuery" />
                </q-tab-panel>

                <q-tab-panel name="graphql-data">
                    <Code v-if="graphqlData" language="json" :value="JSON.stringify(graphqlData, null, 2)"
                        :truncate="5000" />
                    <div v-else>Empty GraphQL result</div>
                </q-tab-panel>

                <q-tab-panel name="jmespath-result">
                    <Code v-if="jmespathResult" language="json"
                        :value="JSON.stringify(jmespathResult, null, 2)"
                        :truncate="5000" />
                    <div v-else>Empty JMESPath result</div>
                </q-tab-panel>
                <q-tab-panel name="jmespath-chart" v-if="example?.chart">
                    <Chart :options="example.chart" :data="jmespathResult" />
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
    </q-card>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

import { request } from 'graphql-request'
import { expressionToGraphQL, search } from 'graphql-jmespath'
import Chart from './Chart.vue'

import { Example, examples } from '../examples'
import Code from './Code.vue'

const $q = useQuasar()

const backendUrl = ref('https://countries.trevorblades.com/')


const expression = ref('')
const graphqlQuery = ref('')
const graphqlData = ref()
const error = ref('')
const jmespathResult = ref()


const example = ref<Example>()

const loadExample = async (selectedExample: Example) => {
    example.value = selectedExample
    // graphqlQuery.value = ''
    expression.value = selectedExample.expression
    run()
    goToResultTab()
}

// * UI refs
const activeTab = ref<
    'graphql-query' | 'graphql-data' | 'jmespath-result' | 'jmespath-chart'
>('graphql-query')

const goToResultTab = () => {
    activeTab.value = example.value?.chart ? 'jmespath-chart' : 'jmespath-result'
}

/**
 * Transform the JMESPath expression to a GraphQL query
 */
const transformToGraphQL = () => {
    error.value = ''
    if (!expression.value) {
        error.value = 'No expression'
        throw Error()
    }
    try {
        const newQuery = expressionToGraphQL(expression.value, {
            pretty: true
        })
        if (newQuery !== graphqlQuery.value) {
            graphqlQuery.value = newQuery
            graphqlData.value = ''
            jmespathResult.value = null
            return true
        }

    } catch (e: any) {
        error.value = e.message
        graphqlQuery.value = ''
        throw Error()
    }
    return false
}

/**
 * Fetch the data from the GraphQL endpoint with the generated GraphQL query
 */
const fetchData = async () => {
    error.value = ''
    if (graphqlQuery.value) {
        $q.loading.show()
        try {
            graphqlData.value = await request(backendUrl.value, graphqlQuery.value)
        } catch (e: any) {
            error.value = e.response?.errors?.[0]?.message || e.message
            graphqlData.value = ''
            throw Error()
        } finally {
            $q.loading.hide()
        }
    }
}

/** 
 * Transform the GraphQL data with the JMESPath expression 
 */
const transformData = () => {
    error.value = ''
    try {
        jmespathResult.value = search(graphqlData.value, expression.value)
    } catch (e: any) {
        error.value = e.message
        jmespathResult.value = jmespathResult
        throw Error()
    }
}

const run = async (e?: Event) => {
    error.value = ''
    try {
        const isNewGraphQLQUery = transformToGraphQL()
        if (isNewGraphQLQUery) {
            // * Fetch new data only if the GraphQL query has changed
            await fetchData()
        }
        transformData()
        if (activeTab.value === 'graphql-query') {
            goToResultTab()
        }

    } catch {
        activeTab.value = 'graphql-query'
    }

}


</script>

