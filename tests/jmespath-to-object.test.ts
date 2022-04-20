import { compile } from 'jmespath'
import { astToObject } from '../src/intercepter'
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
