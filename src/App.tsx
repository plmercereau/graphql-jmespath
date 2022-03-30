import { Expression, ExpressionComponent } from './Expression'
import { tests } from './tests'

// TODO needs graphql schema
/*
@
@.bar
@.foo[0]

*[?[0] == `0`]
*/

// TODO browse the following
/*
functions
identifiers
indices
literal
multiselect
pipe
slice
syntax
unicode
wildcard
*/
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
