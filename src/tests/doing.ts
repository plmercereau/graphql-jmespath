import { Expression } from '../Expression'

export const doing: Expression[] = [
    {
        value: 'foo.bam || foo.bar | baz',
        expected: { foo: { bar: { baz: true }, bam: { baz: true } } }
    }
]
