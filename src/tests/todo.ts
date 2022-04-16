import { Expression } from '../Expression'

// TODO browse the following
/*
functions
indices
literal
pipe
slice
syntax
unicode
wildcard
*/

// ! Next in line: multiselect

export const todo: Expression[] = [
    {
        value: 'foo.nested.*.{a: a,b: b}',
        expected: {}
    },

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
    }
]
