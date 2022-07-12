import { it, describe, expect } from 'vitest'
import { expressionToGraphQL } from '../src'

describe('stop recursing at given paths', () => {
    const expression =
        "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

    it('should stop recursing a single nested path', () => {
        const result = expressionToGraphQL(expression, {
            stopAtPath: 'countries.states'
        })
        expect(result).matchSnapshot()
    })

    it('should stop recursing an array of paths', () => {
        const result = expressionToGraphQL(expression, {
            stopAtPath: ['countries.states', 'countries.languages']
        })
        expect(result).matchSnapshot()
    })

    it('should stop recursing given a stop function', () => {
        const result = expressionToGraphQL(expression, {
            stopAtPath: (path) => path === 'countries.states'
        })
        expect(result).matchSnapshot()
    })

    it('should return the full query when no stopAtPath option is given', () => {
        const result = expressionToGraphQL(expression)
        expect(result).matchSnapshot()
    })

    it('should return the full query when the path to stop at does not exists', () => {
        const result = expressionToGraphQL(expression, {
            stopAtPath: 'inexistent'
        })
        expect(result).matchSnapshot()
    })
})
