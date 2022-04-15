import { Expression, ExpressionComponent } from './Expression'
import { tests } from './tests'

const todo: Expression[] = []

function App() {
    return (
        <div>
            {tests.map(({ value, expected }, index) => (
                <ExpressionComponent
                    key={index}
                    value={value}
                    expected={expected}
                />
            ))}
        </div>
    )
}

export default App
