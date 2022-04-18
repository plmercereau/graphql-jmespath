import { Expression } from '../Expression'

export const doing: Expression[] = [
    {
        value: "reservations[].instances[].[tags[?Key=='Name'].Values[] | [0], type, state.name]",
        expected: {
            reservations: {
                instances: {
                    tags: {
                        Key: true,
                        Values: true // TODO missing
                    },
                    type: true,
                    state: {
                        name: true
                    }
                }
            }
        }
    }
]
