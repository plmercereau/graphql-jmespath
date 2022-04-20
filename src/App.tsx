import { ExpressionComponent } from './Expression'
import { expressions } from '../tests/expressions'

function App() {
    return (
        <div>
            {expressions.map(({ expression, expected }, index) => (
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
