import { Expression } from '../Expression'

export const done: Expression[] = [
    {
        value: 'foo[?!(key||bar)]',
        expected: {
            foo: {
                key: true,
                bar: true
            }
        }
    },
    {
        value: '*[?[0] == `0`]',
        expected: {
            '*': true
        }
    },
    {
        value: 'sort_by(people, &age)',
        expected: {
            people: {
                age: true
            }
        }
    },
    {
        value: 'foo[].not_null(f, e, d, c, b, a)',
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
        value: 'sort_by(people, &to_number(age_str))',
        expected: {
            people: {
                age_str: true
            }
        }
    },
    {
        value: 'max_by(people, &to_number(age_str))',
        expected: {
            people: {
                age_str: true
            }
        }
    },
    {
        value: 'map(&a, people)',
        expected: {
            people: {
                a: true
            }
        }
    },
    {
        value: 'map(&foo.bar, array)',
        expected: {
            array: {
                foo: {
                    bar: true
                }
            }
        }
    },
    {
        value: 'map(&foo.bar.baz, array)',
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
        value: 'map(&[], array)',
        expected: {
            array: true
        }
    },
    {
        value: 'sort_by(people, &age)[].extra',
        expected: {
            people: {
                age: true,
                extra: true
            }
        }
    },
    {
        value: 'sort_by(`[]`, &age)',
        expected: {}
    },
    {
        value: 'not_null(unknown_key, str)',
        expected: {
            unknown_key: true,
            str: true
        }
    },
    {
        value: 'not_null(unknown_key, foo.bar, empty_list, str)',
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
        value: 'sort_by(people, &age)[].name',
        expected: {
            people: {
                age: true,
                name: true
            }
        }
    },
    {
        value: 'sort(keys(objects))',
        expected: {
            objects: true
        }
    },
    {
        value: "contains('abc', 'd')",
        expected: {}
    },
    {
        value: "contains(strings, 'a')",
        expected: {
            strings: true
        }
    },
    {
        value: 'length(strings[0])',
        expected: {
            strings: true
        }
    },
    {
        value: 'merge(`{"a": 1}`, `{"b": 2}`)',
        expected: {}
    },
    {
        value: 'merge(`{"a": 1, "b": 2}`, `{"a": 2, "c": 3}`, `{"d": 4}`)',
        expected: {}
    },
    {
        value: 'avg(numbers)',
        expected: { numbers: true }
    },
    {
        value: 'ceil(`1.2`)',
        expected: {}
    },
    {
        value: 'ceil(decimals[2])',
        expected: { decimals: true }
    },
    {
        value: 'abs(`-24`)',
        expected: {}
    },
    {
        value: 'abs(array[1])',
        expected: {
            array: true
        }
    },

    {
        value: 'abs(foo)',
        expected: {
            foo: true
        }
    },
    {
        value: 'sort_by(Contents, &Date)[*].{Key: Key, Size: Size}',
        expected: { Contents: { Date: true, Key: true, Size: true } }
    },
    {
        value: 'foo[*].bar[*] | [0][0]',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: 'foo.*.notbaz | [*]',
        expected: {
            foo: {
                '*': {
                    notbaz: true
                }
            }
        }
    },
    {
        value: '[[*],*]',
        expected: {
            '*': true
        }
    },
    {
        value: 'foo.[baz[*].not_there || baz[*].bar, qux[0]]',
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
        value: 'foo.[baz[*].bar, qux[0]]',
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
        value: 'foo.[baz[*].[bar, boo], qux[0]]',
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
        value: 'foo.[includeme, bar.baz[*].common]',
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
        value: 'foo.[includeme, bar.baz[*].none]',
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
        value: 'reservations[*].instances[*].{id: id, name: name}',
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
        value: 'people[?general.id==`100`] | [0].general',
        expected: {
            people: {
                general: {
                    id: true
                }
            }
        }
    },
    {
        value: 'people[?general.id==`100`].general | [0]',
        expected: {
            people: {
                general: {
                    id: true
                }
            }
        }
    },
    {
        value: 'people[?age > `20`].{the_name: name, the_age: age}',
        expected: {
            people: {
                name: true,
                age: true
            }
        }
    },
    {
        value: 'people[*].{name: name, tags: tags[0]}',
        expected: {
            people: {
                name: true,
                tags: true
            }
        }
    },
    {
        value: 'people[?age > `20`].[name, age]',
        expected: {
            people: {
                name: true,
                age: true
            }
        }
    },
    {
        value: 'people[?age > `20`].[name]',
        expected: {
            people: {
                name: true,
                age: true
            }
        }
    },
    {
        value: 'books.[author.[name,dob,themes], title]',
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
    { value: 'people[*].first', expected: { people: { first: true } } },
    { value: 'people.*.first', expected: { people: { '*': { first: true } } } },
    {
        value: '{"x": foo, "y": bar} | [y.baz, x.boo]',
        expected: { foo: { boo: true }, bar: { baz: true } }
    },
    {
        value: '{"x": foo, "y": bar} | {"z": y.baz.boo}',
        expected: { bar: { baz: { boo: true } } }
    },

    {
        value: '{"a": foo.bar, "b": foo.other} | *.baz',
        expected: {
            foo: { bar: { baz: true }, other: { baz: true } }
        }
    },
    {
        value: 'foo | other || bar',
        expected: { foo: { other: true, bar: true } }
    },
    {
        value: 'foo.bam || bar | baz',
        expected: { foo: { bam: { baz: true } }, bar: { baz: true } }
    },
    {
        value: '{"x": foo, "y": bof} | [y.bar]',
        expected: {
            bof: {
                bar: true
            }
        }
    },
    {
        value: '{"a": foo.bar, "b": foo.baz} | [a.other, b.sub]',
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
        value: '{"a": foo.bar, "b": foo.other} | a',
        expected: {
            foo: {
                bar: true
            }
        }
    },
    {
        value: '{"a": foo.bar, "b": foo.other} | b',
        expected: {
            foo: {
                other: true
            }
        }
    },
    {
        value: "instances[].[tags[?Key=='Name'].Values[] | [0]]",
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
        value: 'foo | bar',
        expected: { foo: { bar: true } }
    },
    {
        value: 'foo | bar | baz',
        expected: { foo: { bar: { baz: true } } }
    },
    {
        value: "reservations[].instances[].[tags[?Key=='Name'].Values[] | [0], type, state.name]",
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
        value: 'foo.* | [0]',
        expected: {
            foo: {
                '*': true
            }
        }
    },
    {
        value: 'foo.bar.* | [0]',
        expected: {
            foo: {
                bar: {
                    '*': true
                }
            }
        }
    },
    {
        value: 'foo.*.baz | [1]',
        expected: {
            foo: {
                '*': {
                    baz: true
                }
            }
        }
    },

    {
        value: 'foo.*.baz | [0]',
        expected: {
            foo: {
                '*': {
                    baz: true
                }
            }
        }
    },
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
