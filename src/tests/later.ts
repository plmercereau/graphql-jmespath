import { Expression } from '../Expression'

// * Tests to pass at a later stage e.g. when GraphQL schema is available

// TODO needs graphql schema
/*
@
@.bar
@.foo[0]

*[?[0] == `0`]
*/

export const later: Expression[] = [
    {
        value: 'foo.[includeme, bar.baz[*].common]',
        expected: {}
    },
    {
        value: 'foo.[includeme, bar.baz[*].none]',
        expected: {}
    },
    {
        value: 'reservations[*].instances[*].{id: id, name: name}',
        expected: {}
    },
    {
        value: 'foo.[baz[*].bar, qux[0]]',
        expected: {}
    },
    {
        value: 'foo.[baz[*].[bar, boo], qux[0]]',
        expected: {}
    },
    {
        value: 'foo.[baz[*].not_there || baz[*].bar, qux[0]]',
        expected: {}
    },
    {
        value: '[[*],*]',
        expected: {}
    },
    {
        value: 'foo.*.notbaz | [*]',
        expected: {}
    },
    {
        value: '{"a": foo.bar, "b": foo.other} | *.baz',
        // expected: { foo: { bar: true, other: true } }
        expected: {}
    }
]
