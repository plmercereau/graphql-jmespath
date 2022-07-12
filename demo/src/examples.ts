import { Icon, World } from 'tabler-icons-react'
import { ChartConfig } from './components/ChartResult'

export type Example = {
    title: string
    expression: string
    Icon?: Icon
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
        Icon: World,
        chart: { type: 'bar', xKey: 'name', valueKey: 'statesCount' }
    }
]
