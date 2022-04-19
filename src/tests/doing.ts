import { Expression } from '../Expression'
export const doing: Expression[] = [
    {
        value: 'sort_by(Contents, &Date)[*].{Key: Key, Size: Size}',
        expected: {}
    }
]
