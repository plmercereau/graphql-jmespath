import { it, describe, expect } from 'vitest'
import { Expression } from '../src'
import { expressions } from './expressions'

describe('jmespath to object', () => {
    expressions.forEach((expression) => {
        it(`Should transform ${JSON.stringify(
            expression
        )} into a JSON object`, () => {
            const obj = new Expression(expression).toObject()
            expect(obj).toMatchSnapshot()
        })
    })
})
