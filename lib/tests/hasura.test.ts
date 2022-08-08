import { it, describe, expect } from 'vitest'
import { expressionToObject } from '../src'

const expression = 'sort_by(people, &age)[].extra'
describe('hasura', () => {
    
        it(`should process ${JSON.stringify(
            expression
        )} into a GraphQL query`, () => {
            const obj = expressionToObject(expression)
            console.log(obj)
            // expect(() =>
            // expressionToObject(expression)
            // ).toThrowErrorMatchingSnapshot()
        })
    })
