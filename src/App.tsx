import { Expression } from './Expression'

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

const testedExpressions = [
    '"foo bar"',
    '"c:\\\\\\\\windows\\\\path"',
    '"\\"\\"\\""',
    'foo[?c == `3` || a == `1` && b == `4`]',
    'foo[?a == `1` && b == `2`]',
    `foo[?name == 'a' || name == 'b']`,
    'foo[?bar==`1`].bar[0]',
    'reservations[].instances[?bar==`1`]',
    'reservations[].instances[?bar==`1`]',
    'reservations[].instances',
    'foo[?key == `null`]',
    'foo[?key == `{"bar": [0]}`]',
    'foo[?age > `25`]',
    'foo[?top.first == top.last]',
    'foo[?top == `{"first": "foo", "last": "bar"}`]',
    'foo[?key == `true`]',
    "foo[?name == 'a']",
    "foo[?top.name == 'a']",
    'foo[?first == last].first',
    'foo[?first == last]',
    "foo[?name == 'a']",
    'True && False',
    'two < one || three < one',
    'one < two',
    'outer.foo || outer.bar',
    'foo\n.\nbar\n.baz',
    'a.b.c.d',
    'a.b.c.d.e.f.g.h',
    'foo[?a==`1`].b.c',

]

const expressions = [
    'reservations[].instances[?bar==`1`][]',
    // 'foo[?@ < `5`]',
]

function App() {
    return (
        <div>
            {expressions.map((value, index) => (
                <Expression key={index} value={value} />
            ))}
        </div>
    )
}

export default App
