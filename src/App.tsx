import { Expression } from './Expression'

// TODO needs graphql schema
/*
@
@.bar
@.foo[0]

*[?[0] == `0`]
*/

// TODO
/*
foo[?key == `{\"bar\": [0]}`]
foo[?key == `null`]
reservations[].instances[?bar==`1`]
reservations[].instances[?bar==`1`][]
foo[?bar==`1`].bar[0]
foo[?a==`1`].b.c
foo[?name == 'a' || name == 'b']
foo[?a == `1` && b == `2`]
foo[?c == `3` || a == `1` && b == `4`]
foo[?@ < `5`]
\"foo bar\"
\"c:\\\\\\\\windows\\\\path\"
\"\\\"\\\"\\\"\"
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

const expressions = [
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
    'a.b.c.d.e.f.g.h'
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
