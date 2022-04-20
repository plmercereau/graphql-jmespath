import { jmespathToObject } from './intercepter'
import { compile } from './jmespath'
export type Expression = {
    expression: string
    expected: any
}
export const ExpressionComponent: React.FC<Expression> = ({
    expression,
    expected
}) => {
    const node = compile(expression)
    const result = jmespathToObject(node)
    const success = JSON.stringify(result) === JSON.stringify(expected)
    if (success) return <div>{expression} ✅</div>
    return (
        <div>
            <h2>Error: {expression}</h2>
            <h3>AST</h3>
            <pre>{JSON.stringify(node, null, 2)}</pre>
            <h3>Result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}
