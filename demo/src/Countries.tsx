import { Container } from '@mantine/core'

import { ExpressionForm } from './components/ExpressionForm'

const expression =
    "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

export const Countries: React.FC = () => {
    return (
        <Container>
            <h1>Countries</h1>
            <ExpressionForm initial={expression} />
        </Container>
    )
}
