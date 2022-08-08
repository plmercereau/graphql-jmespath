<template>
    <q-page padding>
        <q-card>
            <q-card-section class="text-h6"> Expression </q-card-section>
            <q-card-section>
                {{ description }}
            </q-card-section>
            <q-card-section>
                <q-input v-model="expression" label="Expression" autogrow><template v-if="expression" v-slot:append>
                        <q-icon name="cancel" @click.stop.prevent="expression = props.expression"
                            class="cursor-pointer" />
                    </template></q-input>
                <q-btn color="primary" @click="fetch">Run</q-btn>
            </q-card-section>

            <q-card-section>
                <q-tabs v-model="tab" dense active-color="primary" indicator-color="primary" align="justify"
                    inline-label>
                    <q-tab name="graphql-query" icon="mdi-graphql" col label="Gql Query" />
                    <q-tab name="graphql-data" icon="mdi-graphql" label="Gql Result" />
                    <q-tab name="jmespath-result" icon="mdi-code-json" label="Result" />
                    <q-tab name="jmespath-chart" icon="mdi-chart-line" label="Chart" v-if="props.chart" />
                </q-tabs>
                <q-separator />

                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="graphql-query">
                        <div v-if="graphqlQueryError">
                            {{ graphqlQueryError }}
                        </div>
                        <Code v-else language="graphql" :value="graphqlQuery" />
                    </q-tab-panel>

                    <q-tab-panel name="graphql-data">
                        <div v-if="graphqlDataError">
                            {{ graphqlDataError }}
                        </div>
                        <Code v-if="graphqlData" language="json" :value="JSON.stringify(graphqlData, null, 2)"
                            :truncate="2000" />
                    </q-tab-panel>

                    <q-tab-panel name="jmespath-result">
                        <Code v-if="jmespathResult" language="json" :value="JSON.stringify(jmespathResult, null, 2)"
                            :truncate="2000" />
                    </q-tab-panel>
                    <q-tab-panel name="jmespath-chart" v-if="props.chart">
                        <v-chart class="chart" :option="option" :theme="mode" />
                    </q-tab-panel>
                </q-tab-panels>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { watchDebounced, watchOnce } from '@vueuse/core'
import { useQuasar } from 'quasar'

import { request } from 'graphql-request'
import { expressionToGraphQL, search } from 'graphql-jmespath'

import Code from '../components/Code.vue'
import { ChartConfig } from '../types'

import { useDarkLightMode } from '../composables/dark-light-mode'
import { EChartsOption } from 'echarts/types/dist/shared'

const API = 'https://countries.trevorblades.com/'

const $q = useQuasar()

// TODO https://github.com/vuejs/core/issues/4294
const props = defineProps<{
    title: string
    expression: string
    description?: string
    icon?: string
    chart?: ChartConfig
}>()

// * UI refs
const tab = ref<
    'graphql-query' | 'graphql-data' | 'jmespath-result' | 'jmespath-chart'
>('graphql-query')
const expression = ref(props.expression)
const { mode } = useDarkLightMode()

const graphqlQuery = ref('')
const graphqlQueryError = ref('')

const graphqlData = ref()
const graphqlDataError = ref('')

const jmespathResult = ref()
const jmespathResultError = ref('')

const focusResult = () => {
    if (!tab.value.startsWith('jmespath')) {
        tab.value = props.chart ? 'jmespath-chart' : 'jmespath-result'
    }
}

watchDebounced(
    expression,
    () => {
        try {
            graphqlQueryError.value = ''
            if (expression.value) {
                const newQuery = expressionToGraphQL(expression.value, {
                    pretty: true
                })
                if (newQuery !== graphqlQuery.value) {
                    graphqlQuery.value = newQuery
                    graphqlData.value = ''
                    jmespathResult.value = null
                    tab.value = 'graphql-query'
                } else {
                    runExpression()
                }
            }
        } catch (e: any) {
            console.log('Error in transforming the expression into GraphQL', e)
            graphqlQueryError.value = e.message
            graphqlQuery.value = ''
            tab.value = 'graphql-query'
        }
    },
    { debounce: 300, immediate: true }
)

watchOnce(graphqlQuery, () => {
    // * triggers only once, initial query
    if (props.expression) {
        fetch()
    }
})

const runExpression = () => {
    try {
        jmespathResultError.value = ''
        jmespathResult.value = search(graphqlData.value, expression.value)
    } catch (e: any) {
        console.log('Error in running jmespath', e)
        jmespathResultError.value = e.message
        jmespathResult.value = jmespathResult
        tab.value = 'jmespath-result'
    }
}
const fetch = async () => {
    if (graphqlQuery.value) {
        $q.loading.show()
        try {
            graphqlDataError.value = ''
            graphqlData.value = await request(API, graphqlQuery.value)
            runExpression()
            focusResult()
        } catch (e: any) {
            console.log('Error in fetching graphql', e)
            tab.value = 'graphql-data'
            graphqlDataError.value = e.message
            graphqlData.value = ''
        } finally {
            $q.loading.hide()
        }
    }
}


const option = computed<EChartsOption | null>(() => {
    const chart = props.chart
    if (!chart) {
        return null
    }
    const result: EChartsOption = {
        // title: {
        //     text: props.title,
        //     left: 'center'
        // },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
            type: chart.type,
            name: chart.name,
            data: (jmespathResult.value || []).map((item: any) => ({
                name: item[chart.key],
                value: item[chart.value]
            }))
        }]

    }
    if (chart.type === 'bar') {
        result.xAxis = {
            data: (jmespathResult.value || []).map((item: any) => item[chart.key])
        }
        result.yAxis = {}
        if (chart.name) {
            result.legend = {
                orient: 'vertical',
                left: 'left',
                data: [chart.name]
            }
        }
    }
    if (chart.type === 'pie') {
        result.legend = {
            orient: 'vertical',
            left: 'left',
            data: (jmespathResult.value || []).map((item: any) => item.name)
        }
    }
    return result
})




</script>

<style scoped>
.chart {
    height: 50vh;
}
</style>
