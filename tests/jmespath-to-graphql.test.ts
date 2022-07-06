import { it, describe, expect } from 'vitest'
import { jmespathToGraphQL } from '../src/lib'
import { validExpressions, invalidExpressions } from './expressions'

describe('jmespath to GraphQL', () => {
    invalidExpressions.forEach((expression) => {
        it(`should fail transforming ${JSON.stringify(
            expression
        )} into a GraphQL query`, () => {
            expect(() =>
                jmespathToGraphQL(expression)
            ).toThrowErrorMatchingSnapshot()
        })
    })

    validExpressions.forEach((expression) => {
        it(`should transform ${JSON.stringify(
            expression
        )} into a GraphQL query`, () => {
            const query = jmespathToGraphQL(expression)
            expect(query).toMatchSnapshot()
        })
    })
})
