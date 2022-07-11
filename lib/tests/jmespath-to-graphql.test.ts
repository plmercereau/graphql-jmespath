import { it, describe, expect } from 'vitest'
import { Expression } from '../src'
import { validExpressions, invalidExpressions } from './expressions'

describe('jmespath to GraphQL', () => {
    invalidExpressions.forEach((expression) => {
        it(`should fail transforming ${JSON.stringify(
            expression
        )} into a GraphQL query`, () => {
            expect(() =>
                new Expression(expression).toGraphQL()
            ).toThrowErrorMatchingSnapshot()
        })
    })

    validExpressions.forEach((expression) => {
        it(`should transform ${JSON.stringify(
            expression
        )} into a GraphQL query`, () => {
            const query = new Expression(expression).toGraphQL()
            expect(query).toMatchSnapshot()
        })
    })

    describe('jmespath to GraphQL using custom root query', () => {
        it('should work from a custom root query', () => {
            const query = new Expression('[roles.[id, name], displayName]', {
                rootQuery: 'users'
            }).toGraphQL()
            expect(query).toMatchSnapshot()
        })

        it('should work from a custom root query with arguments', () => {
            const query = new Expression('[roles.[id, name], displayName]', {
                rootQuery: 'users',
                rootArgs: { where: { id: { _eq: '123' } } }
            }).toGraphQL()
            expect(query).toMatchSnapshot()
        })
    })
})
