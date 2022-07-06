import { it, describe, expect } from 'vitest'
import { compile } from 'jmespath'
import { astToObject } from '../src/lib'
import { expressions } from './expressions'

describe('jmespath to object', () => {
    expressions.forEach((expression) => {
        it(`Should transform ${JSON.stringify(
            expression
        )} into a JSON object`, () => {
            const ast = compile(expression)
            const obj = astToObject(ast)
            expect(obj).toMatchSnapshot()
        })
    })
})
