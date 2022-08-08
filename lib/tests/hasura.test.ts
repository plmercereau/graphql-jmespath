import { it, describe, expect } from 'vitest'
import { expressionToGraphQL } from '../src'
import { options } from '../src/hasura'
import { validExpressions } from './expressions'

// TODO complete comparators in expressions e.g. !=, >=, etc
describe('hasura', () => {
    validExpressions.forEach((expression) => {
        it(`should transform ${JSON.stringify(
            expression
        )} into a GraphQL query`, () => {
            const query = expressionToGraphQL(expression, options)
            expect(query).toMatchSnapshot()
        })
    })
})
