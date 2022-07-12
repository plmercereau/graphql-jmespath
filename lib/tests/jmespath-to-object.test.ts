import { it, describe, expect } from 'vitest'
import { expressionToObject } from '../src'
import { expressions } from './expressions'

describe('jmespath to object', () => {
    expressions.forEach((expression) => {
        it(`Should transform ${JSON.stringify(
            expression
        )} into a JSON object`, () => {
            const obj = expressionToObject(expression)
            expect(obj).toMatchSnapshot()
        })
    })
})
