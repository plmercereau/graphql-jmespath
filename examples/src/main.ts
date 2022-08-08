import { createApp } from 'vue'
import { Quasar, LocalStorage, Loading } from 'quasar'
import quasarLang from 'quasar/lang/en-GB'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { paramCase } from 'param-case'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v6/mdi-v6.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// @ts-ignore
import VueHighlightJS from 'vue3-highlightjs'

import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent
} from 'echarts/components'

import App from './App.vue'
import Home from './pages/Home.vue'
import Expression from './pages/Expression.vue'

use([
    CanvasRenderer,
    BarChart,
    PieChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent
])

import { examples } from './examples'
const routes: RouteRecordRaw[] = [
    { path: '/', component: Home },
    ...examples.map((e) => ({
        path: `/${paramCase(e.title)}`,
        component: Expression,

        props: e
    }))
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App)
    .use(Quasar, {
        plugins: [LocalStorage, Loading],
        lang: quasarLang
    })
    .use(router)
    .use(VueHighlightJS)
    .component('v-chart', ECharts)
    .mount('#app')
