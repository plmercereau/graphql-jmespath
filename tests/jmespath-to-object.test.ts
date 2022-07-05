import { it, describe, expect } from 'vitest'
import { compile } from 'jmespath'
import { astToObject } from '../src/lib'
import { expressions } from './expressions'

describe('jmespath to object', () => {
    expressions.forEach(({ expression, expected }) => {
        it(JSON.stringify(expression), () => {
            const ast = compile(expression)
            const { value } = astToObject(ast)
            expect(value).toEqual(expected)
        })
    })
})
