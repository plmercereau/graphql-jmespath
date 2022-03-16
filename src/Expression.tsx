import { jmespathToObject } from './intercepter'
import { compile } from './jmespath'

export const Expression: React.FC<{value:string}> = ({value: expression}) => {
    const node = compile(expression)
    const result = jmespathToObject(node)
    return (
        <div>
            <h2>Expression: {expression}</h2>
            <h2>AST</h2>
            <pre>{JSON.stringify(node, null, 2)}</pre>
            <h2>Result</h2>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
    )
}
