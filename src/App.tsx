import { ExpressionComponent } from './Expression'
import { tests } from './tests'

function App() {
    return (
        <div>
            {tests.map(({ expression, expected }, index) => (
                <ExpressionComponent
                    key={index}
                    expression={expression}
                    expected={expected}
                />
            ))}
        </div>
    )
}

export default App
