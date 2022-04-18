import { Expression } from '../Expression'

export const done: Expression[] = [
    {
        value: 'foo.bar[-2]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo[:20]',
        expected: {
            foo: true
        }
    },
    {
        value: 'foo[0:20]',
        expected: {
            foo: true
        }
    },
    {
        value: 'foo.nested.*.{a: a,b: b}',
        expected: {
            foo: {
                nested: {
                    '*': {
                        a: true,
                        b: true
                    }
                }
            }
        }
    },
    {
        value: 'foo.*.bar.baz',
        expected: {
            foo: {
                '*': {
                    bar: {
                        baz: true
                    }
                }
            }
        }
    },
    {
        value: 'foo.{"foo.bar": bar}',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo.{bar: bar, baz: baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.{"bar": bar, "baz": baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: '{"baz": baz, "qux\\"": "qux\\""}',
        expected: {
            baz: true,
            'qux"': true
        }
    },
    {
        value: 'foo.{bar: bar.baz[1],includeme: includeme}',
        expected: {
            foo: {
                bar: {
                    baz: true
                },
                includeme: true
            }
        }
    },
    {
        value: 'foo.{"bar.baz.two": bar.baz[1].two, includeme: includeme}',
        expected: {
            foo: {
                bar: {
                    baz: {
                        two: true
                    }
                },
                includeme: true
            }
        }
    },
    {
        value: 'foo.[includeme, bar.baz[].common]',
        expected: {
            foo: {
                includeme: true,
                bar: {
                    baz: {
                        common: true
                    }
                }
            }
        }
    },
    {
        value: 'foo.{bar: bar, baz: baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.[bar,baz]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo[]',
        expected: { foo: true }
    },
    {
        value: 'foo.bar[].a',
        expected: {
            foo: {
                bar: {
                    a: true
                }
            }
        }
    },
    {
        value: 'foo.[baz][]',
        expected: {
            foo: {
                baz: true
            }
        }
    },
    {
        value: 'foo[].[baz, qux]',
        expected: {
            foo: {
                baz: true,
                qux: true
            }
        }
    },
    {
        value: 'foo[].bar[].[baz, qux][]',
        expected: {
            foo: {
                bar: {
                    baz: true,
                    qux: true
                }
            }
        }
    },
    {
        value: 'foo.[bar[0],baz[3]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.[bar,baz[1]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.[bar,baz[2]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.[bar,baz[3]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo[].bar[].[baz, qux]',
        expected: {
            foo: {
                bar: {
                    baz: true,
                    qux: true
                }
            }
        }
    },
    {
        value: 'foo[].bar[].[baz]',
        expected: {
            foo: {
                bar: {
                    baz: true
                }
            }
        }
    },
    {
        value: 'reservations[].instances[].{id: id, name: name}',
        expected: {
            reservations: {
                instances: {
                    id: true,
                    name: true
                }
            }
        }
    },
    {
        value: 'reservations[].instances[].[id, name]',
        expected: {
            reservations: {
                instances: {
                    id: true,
                    name: true
                }
            }
        }
    },
    {
        value: 'foo',
        expected: {
            foo: true
        }
    },
    {
        value: 'foo[]',
        expected: {
            foo: true
        }
    },
    {
        value: 'foo[].bar',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo[].bar[]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo.[bar,baz[0]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.{bar:bar,baz:baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.[bar,qux]',
        expected: {
            foo: {
                bar: true,
                qux: true
            }
        }
    },
    {
        value: 'foo.[bar,noexist]',
        expected: {
            foo: {
                bar: true,
                noexist: true
            }
        }
    },
    {
        value: 'foo.[noexist,alsonoexist]',
        expected: {
            foo: {
                noexist: true,
                alsonoexist: true
            }
        }
    },
    {
        value: '{bar: bar}',
        expected: {
            bar: true
        }
    },
    {
        value: '{otherkey: bar}',
        expected: {
            bar: true
        }
    },
    {
        value: 'foo.[bar]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo.[bar,baz]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        value: 'foo.nested.three.{a: a, cinner: c.inner}',
        expected: {
            foo: {
                nested: {
                    three: {
                        a: true,
                        c: {
                            inner: true
                        }
                    }
                }
            }
        }
    },
    {
        value: 'foo.nested.three.{a: a, c: c.inner.bad.key}',
        expected: {
            foo: {
                nested: {
                    three: {
                        a: true,
                        c: {
                            inner: {
                                bad: {
                                    key: true
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    {
        value: 'foo.{a: nested.one.a, b: nested.two.b}',
        expected: {
            foo: {
                nested: {
                    one: {
                        a: true
                    },
                    two: {
                        b: true
                    }
                }
            }
        }
    },
    {
        value: 'foo.badkey.{nokey: nokey, alsonokey: alsonokey}',
        expected: {
            foo: {
                badkey: {
                    nokey: true,
                    alsonokey: true
                }
            }
        }
    },
    {
        value: 'foo.{bar: bar,qux: qux}',
        expected: {
            foo: {
                bar: true,
                qux: true
            }
        }
    },
    {
        value: 'foo.{bar: bar, noexist: noexist}',
        expected: {
            foo: {
                bar: true,
                noexist: true
            }
        }
    },
    {
        value: 'foo.{noexist: noexist, alsonoexist: alsonoexist}',
        expected: {
            foo: {
                noexist: true,
                alsonoexist: true
            }
        }
    },
    {
        value: 'foo.{bar: bar}',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo.{"bar": bar}',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo.baz | [0]',
        expected: { foo: { baz: true } }
    },
    {
        value: 'foo | bar',
        expected: { foo: { bar: true } }
    },
    {
        value: 'foo | bar | baz',
        expected: { foo: { bar: { baz: true } } }
    },
    {
        value: 'not_there | [0]',
        expected: { not_there: true }
    },
    {
        value: '[foo.bar, foo.other, third] | [0]',
        expected: { foo: { bar: true, other: true }, third: true }
    },
    {
        value: '__L',
        expected: {
            __L: true
        }
    },
    {
        value: '"!\\r"',
        expected: {
            '!\r': true
        }
    },
    {
        value: 'Y_1623',
        expected: {
            Y_1623: true
        }
    },
    {
        value: '"\\tF\\uCebb"',
        expected: {
            '\tF캻': true
        }
    },
    {
        value: '" \\t"',
        expected: {
            ' \t': true
        }
    },
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
