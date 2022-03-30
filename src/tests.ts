import { Expression } from './Expression'

export const tests: Expression[] = [
    {
        value: 'foo[?bar==`1`].bar[0]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    { value: '"foo bar"', expected: { 'foo bar': true } },
    {
        value: '"c:\\\\\\\\windows\\\\path"',
        expected: {
            'c:\\\\windows\\path': true
        }
    },
    { value: '"\\"\\"\\""', expected: { '"""': true } },
    {
        value: 'foo[?c == `3` || a == `1` && b == `4`]',
        expected: {
            foo: {
                c: true,
                a: true,
                b: true
            }
        }
    },
    {
        value: 'foo[?a == `1` && b == `2`]',
        expected: {
            foo: {
                a: true,
                b: true
            }
        }
    },
    {
        value: `foo[?name == 'a' || name == 'b']`,
        expected: {
            foo: {
                name: true
            }
        }
    },
    {
        value: 'reservations[].instances[?bar==`1`]',
        expected: {
            reservations: {
                instances: {
                    bar: true
                }
            }
        }
    },
    {
        value: 'reservations[].instances[?bar==`1`]',
        expected: {
            reservations: {
                instances: {
                    bar: true
                }
            }
        }
    },
    {
        value: 'reservations[].instances',
        expected: {
            reservations: {
                instances: true
            }
        }
    },
    { value: 'foo[?key == `null`]', expected: { foo: { key: true } } },
    { value: 'foo[?key == `{"bar": [0]}`]', expected: { foo: { key: true } } },
    { value: 'foo[?age > `25`]', expected: { foo: { age: true } } },
    {
        value: 'foo[?top.first == top.last]',
        expected: { foo: { top: { first: true, last: true } } }
    },
    {
        value: 'foo[?top == `{"first": "foo", "last": "bar"}`]',
        expected: { foo: { top: true } }
    },
    { value: 'foo[?key == `true`]', expected: { foo: { key: true } } },
    { value: "foo[?name == 'a']", expected: { foo: { name: true } } },
    {
        value: "foo[?top.name == 'a']",
        expected: { foo: { top: { name: true } } }
    },
    {
        value: 'foo[?first == last].first',
        expected: { foo: { first: true, last: true } }
    },
    {
        value: 'foo[?first == last]',
        expected: { foo: { first: true, last: true } }
    },
    { value: "foo[?name == 'a']", expected: { foo: { name: true } } },
    { value: 'True && False', expected: { True: true, False: true } },
    {
        value: 'two < one || three < one',
        expected: { two: true, one: true, three: true }
    },
    { value: 'one < two', expected: { one: true, two: true } },
    {
        value: 'outer.foo || outer.bar',
        expected: { outer: { foo: true, bar: true } }
    },
    {
        value: 'foo\n.\nbar\n.baz',
        expected: {
            foo: {
                bar: {
                    baz: true
                }
            }
        }
    },
    { value: 'a.b.c.d', expected: { a: { b: { c: { d: true } } } } },
    {
        value: 'a.b.c.d.e.f.g.h',
        expected: { a: { b: { c: { d: { e: { f: { g: { h: true } } } } } } } }
    },
    {
        value: 'foo[?a==`1`].b.c',
        expected: { foo: { b: { c: true }, a: true } }
    },
    {
        value: 'reservations[].instances[?bar==`1`][]',
        expected: { reservations: { instances: { bar: true } } }
    },
    {
        value: 'reservations[].instances[?bar==`1`]',
        expected: { reservations: { instances: { bar: true } } }
    }
]
