import { it, describe, expect } from 'vitest'
import { JMESPathGraphQL } from '../src/lib'
import { expressions } from './expressions'

describe('jmespath to object', () => {
    expressions.forEach((expression) => {
        it(`Should transform ${JSON.stringify(
            expression
        )} into a JSON object`, () => {
            const obj = new JMESPathGraphQL(expression).toObject()
            expect(obj).toMatchSnapshot()
        })
    })
})
