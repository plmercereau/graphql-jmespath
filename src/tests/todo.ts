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
        value: 'foo.{bar: bar}',
        expected: {}
    },
    {
        value: 'foo.{"bar": bar}',
        expected: {}
    },
    {
        value: 'foo.{"foo.bar": bar}',
        expected: {}
    },
    {
        value: 'foo.{bar: bar, baz: baz}',
        expected: {}
    },
    {
        value: 'foo.{"bar": bar, "baz": baz}',
        expected: {}
    },
    {
        value: '{"baz": baz, "qux\\"": "qux\\""}',
        expected: {}
    },
    {
        value: 'foo.{bar:bar,baz:baz}',
        expected: {}
    },
    {
        value: 'foo.{bar: bar,qux: qux}',
        expected: {}
    },
    {
        value: 'foo.{bar: bar, noexist: noexist}',
        expected: {}
    },
    {
        value: 'foo.{noexist: noexist, alsonoexist: alsonoexist}',
        expected: {}
    },
    {
        value: 'foo.badkey.{nokey: nokey, alsonokey: alsonokey}',
        expected: {}
    },
    {
        value: 'foo.nested.*.{a: a,b: b}',
        expected: {}
    },
    {
        value: 'foo.nested.three.{a: a, cinner: c.inner}',
        expected: {}
    },
    {
        value: 'foo.nested.three.{a: a, c: c.inner.bad.key}',
        expected: {}
    },
    {
        value: 'foo.{a: nested.one.a, b: nested.two.b}',
        expected: {}
    },
    {
        value: '{bar: bar, baz: baz}',
        expected: {}
    },
    {
        value: '{bar: bar}',
        expected: {}
    },
    {
        value: '{otherkey: bar}',
        expected: {}
    },
    {
        value: '{no: no, exist: exist}',
        expected: {}
    },
    {
        value: 'foo.[bar]',
        expected: {}
    },
    {
        value: 'foo.[bar,baz]',
        expected: {}
    },
    {
        value: 'foo.[bar,qux]',
        expected: {}
    },
    {
        value: 'foo.[bar,noexist]',
        expected: {}
    },
    {
        value: 'foo.[noexist,alsonoexist]',
        expected: {}
    },
    {
        value: 'foo.{bar:bar,baz:baz}',
        expected: {}
    },
    {
        value: 'foo.[bar,baz[0]]',
        expected: {}
    },
    {
        value: 'foo.[bar,baz[1]]',
        expected: {}
    },
    {
        value: 'foo.[bar,baz[2]]',
        expected: {}
    },
    {
        value: 'foo.[bar,baz[3]]',
        expected: {}
    },
    {
        value: 'foo.[bar[0],baz[3]]',
        expected: {}
    },
    {
        value: 'foo.{bar: bar, baz: baz}',
        expected: {}
    },
    {
        value: 'foo.[bar,baz]',
        expected: {}
    },
    {
        value: 'foo.{bar: bar.baz[1],includeme: includeme}',
        expected: {}
    },
    {
        value: 'foo.{"bar.baz.two": bar.baz[1].two, includeme: includeme}',
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
        value: 'foo.[includeme, bar.baz[].common]',
        expected: {}
    },
    {
        value: 'reservations[*].instances[*].{id: id, name: name}',
        expected: {}
    },
    {
        value: 'reservations[].instances[].{id: id, name: name}',
        expected: {}
    },
    {
        value: 'reservations[].instances[].[id, name]',
        expected: {}
    },
    {
        value: 'foo',
        expected: {}
    },
    {
        value: 'foo[]',
        expected: {}
    },
    {
        value: 'foo[].bar',
        expected: {}
    },
    {
        value: 'foo[].bar[]',
        expected: {}
    },
    {
        value: 'foo[].bar[].[baz, qux]',
        expected: {}
    },
    {
        value: 'foo[].bar[].[baz]',
        expected: {}
    },
    {
        value: 'foo[].bar[].[baz, qux][]',
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
