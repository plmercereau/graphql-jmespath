import { createApp } from 'vue'
import { Quasar, LocalStorage, Loading } from 'quasar'
import quasarLang from 'quasar/lang/en-GB'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

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

use([
    CanvasRenderer,
    BarChart,
    PieChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent
])

createApp(App)
    .use(Quasar, {
        plugins: [LocalStorage, Loading],
        lang: quasarLang
    })
    .use(VueHighlightJS)
    .component('v-chart', ECharts)
    .mount('#app')
