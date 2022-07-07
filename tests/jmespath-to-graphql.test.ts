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

    describe('jmespath to GraphQL using custom root query', () => {
        it('should work from a custom root query', () => {
            const query = jmespathToGraphQL('[roles.[id, name], displayName]', {
                rootQuery: 'users'
            })
            expect(query).toMatchSnapshot()
        })

        it('should work from a custom root query with arguments', () => {
            const query = jmespathToGraphQL('[roles.[id, name], displayName]', {
                rootQuery: 'users',
                rootArgs: { where: { id: { _eq: '123' } } }
            })
            expect(query).toMatchSnapshot()
        })
    })
})
