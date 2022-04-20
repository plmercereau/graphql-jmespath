import { Expression } from './Expression'

export const expressions: Expression[] = [
    {
        expression: 'foo | bar',
        expected: { foo: { bar: true } }
    },
    {
        expression: 'people[?general.id==`100`] | [0].general',
        expected: {
            people: {
                general: {
                    id: true
                }
            }
        }
    },
    {
        expression: 'foo[*].bar[*].kind',
        expected: {
            foo: {
                bar: {
                    kind: true
                }
            }
        }
    },
    {
        expression: 'foo[*].bar[0].kind',
        expected: {
            foo: {
                bar: {
                    kind: true
                }
            }
        }
    },
    {
        expression: '*[0]',
        expected: {
            '*': true
        }
    },
    {
        expression: 'foo[?`5` > @]',
        expected: {
            foo: {}
        }
    },
    {
        expression: 'foo[?@ == @]',
        expected: {
            foo: {}
        }
    },
    { expression: '@.bar', expected: { bar: true } },
    { expression: '@', expected: {} },
    {
        expression: '@.foo[0]',
        expected: {
            foo: true
        }
    },
    {
        expression: 'length(@)',
        expected: {}
    },
    {
        expression: "join('|', decimals[].to_string(@))",
        expected: {
            decimals: {}
        }
    },
    {
        expression: 'sum(array[].to_number(@))',
        expected: {
            array: {}
        }
    },
    {
        expression:
            "locations[?state == 'WA'].name | sort(@)[-2:] | {WashingtonCities: join(', ', @)}",
        expected: {
            locations: {
                name: true,
                state: true
            }
        }
    },
    {
        expression: 'foo[?!(key||bar)]',
        expected: {
            foo: {
                key: true,
                bar: true
            }
        }
    },
    {
        expression: '*[?[0] == `0`]',
        expected: {
            '*': true
        }
    },
    {
        expression: 'sort_by(people, &age)',
        expected: {
            people: {
                age: true
            }
        }
    },
    {
        expression: 'foo[].not_null(f, e, d, c, b, a)',
        expected: {
            foo: {
                f: true,
                e: true,
                d: true,
                c: true,
                b: true,
                a: true
            }
        }
    },
    {
        expression: 'sort_by(people, &to_number(age_str))',
        expected: {
            people: {
                age_str: true
            }
        }
    },
    {
        expression: 'max_by(people, &to_number(age_str))',
        expected: {
            people: {
                age_str: true
            }
        }
    },
    {
        expression: 'map(&a, people)',
        expected: {
            people: {
                a: true
            }
        }
    },
    {
        expression: 'map(&foo.bar, array)',
        expected: {
            array: {
                foo: {
                    bar: true
                }
            }
        }
    },
    {
        expression: 'map(&foo.bar.baz, array)',
        expected: {
            array: {
                foo: {
                    bar: {
                        baz: true
                    }
                }
            }
        }
    },
    {
        expression: 'map(&[], array)',
        expected: {
            array: true
        }
    },
    {
        expression: 'sort_by(people, &age)[].extra',
        expected: {
            people: {
                age: true,
                extra: true
            }
        }
    },
    {
        expression: 'sort_by(`[]`, &age)',
        expected: {}
    },
    {
        expression: 'not_null(unknown_key, str)',
        expected: {
            unknown_key: true,
            str: true
        }
    },
    {
        expression: 'not_null(unknown_key, foo.bar, empty_list, str)',
        expected: {
            unknown_key: true,
            foo: {
                bar: true
            },
            empty_list: true,
            str: true
        }
    },
    {
        expression: 'sort_by(people, &age)[].name',
        expected: {
            people: {
                age: true,
                name: true
            }
        }
    },
    {
        expression: 'sort(keys(objects))',
        expected: {
            objects: true
        }
    },
    {
        expression: "contains('abc', 'd')",
        expected: {}
    },
    {
        expression: "contains(strings, 'a')",
        expected: {
            strings: true
        }
    },
    {
        expression: 'length(strings[0])',
        expected: {
            strings: true
        }
    },
    {
        expression: 'merge(`{"a": 1}`, `{"b": 2}`)',
        expected: {}
    },
    {
        expression: 'merge(`{"a": 1, "b": 2}`, `{"a": 2, "c": 3}`, `{"d": 4}`)',
        expected: {}
    },
    {
        expression: 'avg(numbers)',
        expected: { numbers: true }
    },
    {
        expression: 'ceil(`1.2`)',
        expected: {}
    },
    {
        expression: 'ceil(decimals[2])',
        expected: { decimals: true }
    },
    {
        expression: 'abs(`-24`)',
        expected: {}
    },
    {
        expression: 'abs(array[1])',
        expected: {
            array: true
        }
    },

    {
        expression: 'abs(foo)',
        expected: {
            foo: true
        }
    },
    {
        expression: 'sort_by(Contents, &Date)[*].{Key: Key, Size: Size}',
        expected: { Contents: { Date: true, Key: true, Size: true } }
    },
    {
        expression: 'foo[*].bar[*] | [0][0]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo.*.notbaz | [*]',
        expected: {
            foo: {
                '*': {
                    notbaz: true
                }
            }
        }
    },
    {
        expression: '[[*],*]',
        expected: {
            '*': true
        }
    },
    {
        expression: 'foo.[baz[*].not_there || baz[*].bar, qux[0]]',
        expected: {
            foo: {
                baz: {
                    not_there: true,
                    bar: true
                },
                qux: true
            }
        }
    },
    {
        expression: 'foo.[baz[*].bar, qux[0]]',
        expected: {
            foo: {
                baz: {
                    bar: true
                },
                qux: true
            }
        }
    },
    {
        expression: 'foo.[baz[*].[bar, boo], qux[0]]',
        expected: {
            foo: {
                baz: {
                    bar: true,
                    boo: true
                },
                qux: true
            }
        }
    },
    {
        expression: 'foo.[includeme, bar.baz[*].common]',
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
        expression: 'foo.[includeme, bar.baz[*].none]',
        expected: {
            foo: {
                includeme: true,
                bar: {
                    baz: {
                        none: true
                    }
                }
            }
        }
    },
    {
        expression: 'reservations[*].instances[*].{id: id, name: name}',
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
        expression: 'people[?general.id==`100`].general | [0]',
        expected: {
            people: {
                general: {
                    id: true
                }
            }
        }
    },
    {
        expression: 'people[?age > `20`].{the_name: name, the_age: age}',
        expected: {
            people: {
                name: true,
                age: true
            }
        }
    },
    {
        expression: 'people[*].{name: name, tags: tags[0]}',
        expected: {
            people: {
                name: true,
                tags: true
            }
        }
    },
    {
        expression: 'people[?age > `20`].[name, age]',
        expected: {
            people: {
                name: true,
                age: true
            }
        }
    },
    {
        expression: 'people[?age > `20`].[name]',
        expected: {
            people: {
                name: true,
                age: true
            }
        }
    },
    {
        expression: 'books.[author.[name,dob,themes], title]',
        expected: {
            books: {
                author: {
                    name: true,
                    dob: true,
                    themes: true
                },
                title: true
            }
        }
    },
    { expression: 'people[*].first', expected: { people: { first: true } } },
    {
        expression: 'people.*.first',
        expected: { people: { '*': { first: true } } }
    },
    {
        expression: '{"x": foo, "y": bar} | [y.baz, x.boo]',
        expected: { foo: { boo: true }, bar: { baz: true } }
    },
    {
        expression: '{"x": foo, "y": bar} | {"z": y.baz.boo}',
        expected: { bar: { baz: { boo: true } } }
    },

    {
        expression: '{"a": foo.bar, "b": foo.other} | *.baz',
        expected: {
            foo: { bar: { baz: true }, other: { baz: true } }
        }
    },
    {
        expression: 'foo | other || bar',
        expected: { foo: { other: true, bar: true } }
    },
    {
        expression: 'foo.bam || bar | baz',
        expected: { foo: { bam: { baz: true } }, bar: { baz: true } }
    },
    {
        expression: '{"x": foo, "y": bof} | [y.bar]',
        expected: {
            bof: {
                bar: true
            }
        }
    },
    {
        expression: '{"a": foo.bar, "b": foo.baz} | [a.other, b.sub]',
        expected: {
            foo: {
                bar: {
                    other: true
                },
                baz: {
                    sub: true
                }
            }
        }
    },
    {
        expression: '{"a": foo.bar, "b": foo.other} | a',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: '{"a": foo.bar, "b": foo.other} | b',
        expected: {
            foo: {
                other: true
            }
        }
    },
    {
        expression: "instances[].[tags[?Key=='Name'].Values[] | [0]]",
        expected: {
            instances: {
                tags: {
                    Values: true,
                    Key: true
                }
            }
        }
    },

    {
        expression: 'foo | bar | baz',
        expected: { foo: { bar: { baz: true } } }
    },
    {
        expression:
            "reservations[].instances[].[tags[?Key=='Name'].Values[] | [0], type, state.name]",
        expected: {
            reservations: {
                instances: {
                    tags: {
                        Values: true,
                        Key: true
                    },
                    type: true,
                    state: {
                        name: true
                    }
                }
            }
        }
    },
    {
        expression: 'foo.* | [0]',
        expected: {
            foo: {
                '*': true
            }
        }
    },
    {
        expression: 'foo.bar.* | [0]',
        expected: {
            foo: {
                bar: {
                    '*': true
                }
            }
        }
    },
    {
        expression: 'foo.*.baz | [1]',
        expected: {
            foo: {
                '*': {
                    baz: true
                }
            }
        }
    },

    {
        expression: 'foo.*.baz | [0]',
        expected: {
            foo: {
                '*': {
                    baz: true
                }
            }
        }
    },
    {
        expression: 'foo.bar[-2]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo[:20]',
        expected: {
            foo: true
        }
    },
    {
        expression: 'foo[0:20]',
        expected: {
            foo: true
        }
    },
    {
        expression: 'foo.nested.*.{a: a,b: b}',
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
        expression: 'foo.*.bar.baz',
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
        expression: 'foo.{"foo.bar": bar}',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo.{bar: bar, baz: baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.{"bar": bar, "baz": baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: '{"baz": baz, "qux\\"": "qux\\""}',
        expected: {
            baz: true,
            'qux"': true
        }
    },
    {
        expression: 'foo.{bar: bar.baz[1],includeme: includeme}',
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
        expression: 'foo.{"bar.baz.two": bar.baz[1].two, includeme: includeme}',
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
        expression: 'foo.[includeme, bar.baz[].common]',
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
        expression: 'foo.{bar: bar, baz: baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.[bar,baz]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo[]',
        expected: { foo: true }
    },
    {
        expression: 'foo.bar[].a',
        expected: {
            foo: {
                bar: {
                    a: true
                }
            }
        }
    },
    {
        expression: 'foo.[baz][]',
        expected: {
            foo: {
                baz: true
            }
        }
    },
    {
        expression: 'foo[].[baz, qux]',
        expected: {
            foo: {
                baz: true,
                qux: true
            }
        }
    },
    {
        expression: 'foo[].bar[].[baz, qux][]',
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
        expression: 'foo.[bar[0],baz[3]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.[bar,baz[1]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.[bar,baz[2]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.[bar,baz[3]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo[].bar[].[baz, qux]',
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
        expression: 'foo[].bar[].[baz]',
        expected: {
            foo: {
                bar: {
                    baz: true
                }
            }
        }
    },
    {
        expression: 'reservations[].instances[].{id: id, name: name}',
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
        expression: 'reservations[].instances[].[id, name]',
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
        expression: 'foo',
        expected: {
            foo: true
        }
    },
    {
        expression: 'foo[]',
        expected: {
            foo: true
        }
    },
    {
        expression: 'foo[].bar',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo[].bar[]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo.[bar,baz[0]]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.{bar:bar,baz:baz}',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.[bar,qux]',
        expected: {
            foo: {
                bar: true,
                qux: true
            }
        }
    },
    {
        expression: 'foo.[bar,noexist]',
        expected: {
            foo: {
                bar: true,
                noexist: true
            }
        }
    },
    {
        expression: 'foo.[noexist,alsonoexist]',
        expected: {
            foo: {
                noexist: true,
                alsonoexist: true
            }
        }
    },
    {
        expression: '{bar: bar}',
        expected: {
            bar: true
        }
    },
    {
        expression: '{otherkey: bar}',
        expected: {
            bar: true
        }
    },
    {
        expression: 'foo.[bar]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo.[bar,baz]',
        expected: {
            foo: {
                bar: true,
                baz: true
            }
        }
    },
    {
        expression: 'foo.nested.three.{a: a, cinner: c.inner}',
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
        expression: 'foo.nested.three.{a: a, c: c.inner.bad.key}',
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
        expression: 'foo.{a: nested.one.a, b: nested.two.b}',
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
        expression: 'foo.badkey.{nokey: nokey, alsonokey: alsonokey}',
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
        expression: 'foo.{bar: bar,qux: qux}',
        expected: {
            foo: {
                bar: true,
                qux: true
            }
        }
    },
    {
        expression: 'foo.{bar: bar, noexist: noexist}',
        expected: {
            foo: {
                bar: true,
                noexist: true
            }
        }
    },
    {
        expression: 'foo.{noexist: noexist, alsonoexist: alsonoexist}',
        expected: {
            foo: {
                noexist: true,
                alsonoexist: true
            }
        }
    },
    {
        expression: 'foo.{bar: bar}',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo.{"bar": bar}',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        expression: 'foo.baz | [0]',
        expected: { foo: { baz: true } }
    },
    {
        expression: 'not_there | [0]',
        expected: { not_there: true }
    },
    {
        expression: '[foo.bar, foo.other, third] | [0]',
        expected: { foo: { bar: true, other: true }, third: true }
    },
    {
        expression: '__L',
        expected: {
            __L: true
        }
    },
    {
        expression: '"!\\r"',
        expected: {
            '!\r': true
        }
    },
    {
        expression: 'Y_1623',
        expected: {
            Y_1623: true
        }
    },
    {
        expression: '"\\tF\\uCebb"',
        expected: {
            '\tF캻': true
        }
    },
    {
        expression: '" \\t"',
        expected: {
            ' \t': true
        }
    },
    {
        expression: 'foo[?bar==`1`].bar[0]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    { expression: '"foo bar"', expected: { 'foo bar': true } },
    {
        expression: '"c:\\\\\\\\windows\\\\path"',
        expected: {
            'c:\\\\windows\\path': true
        }
    },
    { expression: '"\\"\\"\\""', expected: { '"""': true } },
    {
        expression: 'foo[?c == `3` || a == `1` && b == `4`]',
        expected: {
            foo: {
                c: true,
                a: true,
                b: true
            }
        }
    },
    {
        expression: 'foo[?a == `1` && b == `2`]',
        expected: {
            foo: {
                a: true,
                b: true
            }
        }
    },
    {
        expression: `foo[?name == 'a' || name == 'b']`,
        expected: {
            foo: {
                name: true
            }
        }
    },
    {
        expression: 'reservations[].instances[?bar==`1`]',
        expected: {
            reservations: {
                instances: {
                    bar: true
                }
            }
        }
    },
    {
        expression: 'reservations[].instances[?bar==`1`]',
        expected: {
            reservations: {
                instances: {
                    bar: true
                }
            }
        }
    },
    {
        expression: 'reservations[].instances',
        expected: {
            reservations: {
                instances: true
            }
        }
    },
    { expression: 'foo[?key == `null`]', expected: { foo: { key: true } } },
    {
        expression: 'foo[?key == `{"bar": [0]}`]',
        expected: { foo: { key: true } }
    },
    { expression: 'foo[?age > `25`]', expected: { foo: { age: true } } },
    {
        expression: 'foo[?top.first == top.last]',
        expected: { foo: { top: { first: true, last: true } } }
    },
    {
        expression: 'foo[?top == `{"first": "foo", "last": "bar"}`]',
        expected: { foo: { top: true } }
    },
    { expression: 'foo[?key == `true`]', expected: { foo: { key: true } } },
    { expression: "foo[?name == 'a']", expected: { foo: { name: true } } },
    {
        expression: "foo[?top.name == 'a']",
        expected: { foo: { top: { name: true } } }
    },
    {
        expression: 'foo[?first == last].first',
        expected: { foo: { first: true, last: true } }
    },
    {
        expression: 'foo[?first == last]',
        expected: { foo: { first: true, last: true } }
    },
    { expression: "foo[?name == 'a']", expected: { foo: { name: true } } },
    { expression: 'True && False', expected: { True: true, False: true } },
    {
        expression: 'two < one || three < one',
        expected: { two: true, one: true, three: true }
    },
    { expression: 'one < two', expected: { one: true, two: true } },
    {
        expression: 'outer.foo || outer.bar',
        expected: { outer: { foo: true, bar: true } }
    },
    {
        expression: 'foo\n.\nbar\n.baz',
        expected: {
            foo: {
                bar: {
                    baz: true
                }
            }
        }
    },
    { expression: 'a.b.c.d', expected: { a: { b: { c: { d: true } } } } },
    {
        expression: 'a.b.c.d.e.f.g.h',
        expected: { a: { b: { c: { d: { e: { f: { g: { h: true } } } } } } } }
    },
    {
        expression: 'foo[?a==`1`].b.c',
        expected: { foo: { b: { c: true }, a: true } }
    },
    {
        expression: 'reservations[].instances[?bar==`1`][]',
        expected: { reservations: { instances: { bar: true } } }
    },
    {
        expression: 'reservations[].instances[?bar==`1`]',
        expected: { reservations: { instances: { bar: true } } }
    }
]
