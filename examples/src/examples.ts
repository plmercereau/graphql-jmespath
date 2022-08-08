// import { Icon, World } from 'tabler-icons-react'
// import { ChartConfig } from './components/ChartResult'

import { ChartConfig } from './types'

export type Example = {
    title: string
    expression: string
    icon?: string
    description?: string
    chart?: ChartConfig
}

export const examples: Example[] = [
    {
        title: 'Country States',
        description:
            'Names of the ten countries with the highest number of states, their number of states, and a comma-separated list of their language codes, sorted by number of states in descending order.',
        expression:
            "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]",
        // Icon: World,
        chart: {
            type: 'pie',
            name: 'Number of states',
            key: 'name',
            value: 'statesCount'
        }
    }
]
