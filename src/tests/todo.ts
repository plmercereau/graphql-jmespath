import { Expression } from '../Expression'

// TODO browse the 'wildcard' file

export const todo: Expression[] = [
    { value: '@', expected: null },
    { value: '@.bar', expected: null },
    { value: '@.foo[0]', expected: null },
    {
        value: 'length(@)',
        expected: 12
    },
    {
        value: "join('|', decimals[].to_string(@))",
        expected: '1.01|1.2|-1.5'
    },
    {
        value: 'sum(array[].to_number(@))',
        expected: 111
    },
    {
        value: 'numbers[].to_string(@)',
        expected: ['-1', '3', '4', '5']
    },
    {
        value: 'array[].to_number(@)',
        expected: [-1, 3, 4, 5, 100]
    },
    {
        value: "locations[?state == 'WA'].name | sort(@)[-2:] | {WashingtonCities: join(', ', @)}",
        expected: {}
    }
]
