import { astToObject, objectToGraphQL } from './lib'
import { compile } from 'jmespath'
import { Expression } from './types'

export const ExpressionComponent: React.FC<Expression> = ({
    expression,
    expected
}) => {
    const node = compile(expression)
    const { value, wildcard } = astToObject(node)
    const success = JSON.stringify(value) === JSON.stringify(expected)
    if (success) {
        const request = objectToGraphQL(value)
        return (
            <div>
                {expression} ✅<pre>{request}</pre>
            </div>
        )
    }

    return (
        <div>
            <h2>Error: {expression}</h2>
            <h3>AST</h3>
            <pre>{JSON.stringify(node, null, 2)}</pre>
            <h3>Result</h3>
            <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
    )
}
