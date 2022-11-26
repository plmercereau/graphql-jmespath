import { ChartConfig } from './types'

export type Example = {
    expression: string
    description?: string
    chart?: ChartConfig
}

export const examples: Example[] = [
    {
        description: 'Name of all countries, sorted alphabetically.',
        expression: 'countries[].name | sort(@)'
    },
    {
        description:
            'Names of the ten countries with most states, their number of states, and a comma-separated list of their language codes, sorted by number of states in descending order.',
        expression:
            "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]",
        chart: {
            type: 'pie',
            // name: 'Number of states',
            key: 'name',
            value: 'statesCount'
        }
    }
]
