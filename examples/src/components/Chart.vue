<template>

    <v-chart v-if="data" class="chart" :option="chartOption"
        :theme="$q.dark.isActive ? 'dark' : 'light'" />
    <div v-else>Empty JMESPath result</div>

</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'



import { EChartsOption } from 'echarts/types/dist/shared'
import { ChartConfig } from '../types'


const props = defineProps<{ options: ChartConfig, data: any }>()

const backgroundColor = useQuasar().dark.isActive ? '#343434' : '#fff'

const chartOption = computed<EChartsOption | null>(() => {
    const result: EChartsOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [{
            type: props.options.type,
            name: 'Data',
            data: (props.data || []).map((item: any) => ({
                name: item[props.options.key],
                value: item[props.options.value]
            }))
        }],
        backgroundColor
    }
    if (props.options.type === 'bar') {
        result.xAxis = {
            data: (props.data || []).map((item: any) => item[props.options.key])
        }
        result.yAxis = {}
        // if (c.name) {
        result.legend = {
            orient: 'vertical',
            left: 'left',
            data: ['Data']
        }
        // }
    }
    if (props.options.type === 'pie') {
        result.legend = {
            orient: 'vertical',
            left: 'left',
            data: (props.data || []).map((item: any) => item.name)
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
