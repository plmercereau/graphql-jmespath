import { Expression } from '../Expression'

export const doing: Expression[] = [
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
    }
]
