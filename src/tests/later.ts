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
        value: 'foo.*.baz | [0]',
        expected: {}
    },
    {
        value: 'foo.*.baz | [1]',
        expected: {}
    },
    {
        value: 'foo.*.baz | [2]',
        expected: {}
    },
    {
        value: 'foo.bar.* | [0]',
        expected: {}
    },
    {
        value: 'foo.*.notbaz | [*]',
        expected: {}
    },
    {
        value: '{"a": foo.bar, "b": foo.other} | *.baz',
        expected: {}
    },
    {
        value: '{"a": foo.bar, "b": foo.other} | a',
        expected: {}
    },
    {
        value: '{"a": foo.bar, "b": foo.other} | b',
        expected: {}
    },
    {
        value: 'foo.bam || foo.bar | baz',
        expected: {}
    },
    {
        value: 'foo | not_there || bar',
        expected: {}
    }
]
