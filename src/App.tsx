import { Intercepter, toGraphQL } from './intercepter'
import { compile, Runtime } from './jmespath'

const expression = 'a.b.c.d'
const runtime = new Runtime();
const interpreter = new Intercepter(runtime);
const node = compile(expression);
const result =  interpreter.graphql(node);
function App() {
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

export default App
