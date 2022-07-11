import { it, describe, expect } from 'vitest'
import { Expression } from '../src'

describe('stop recursing at given paths', () => {
    const expression =
        "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

    it('should stop recursing a single nested path', () => {
        const result = new Expression(expression, {
            stopAtPath: 'countries.states'
        }).toGraphQL()
        expect(result).matchSnapshot()
    })

    it('should stop recursing an array of paths', () => {
        const result = new Expression(expression, {
            stopAtPath: ['countries.states', 'countries.languages']
        }).toGraphQL()
        expect(result).matchSnapshot()
    })

    it('should stop recursing given a stop function', () => {
        const result = new Expression(expression, {
            stopAtPath: (path) => path === 'countries.states'
        }).toGraphQL()
        expect(result).matchSnapshot()
    })

    it('should return the full query when no stopAtPath option is given', () => {
        const result = new Expression(expression).toGraphQL()
        expect(result).matchSnapshot()
    })

    it('should return the full query when the path to stop at does not exists', () => {
        const result = new Expression(expression, {
            stopAtPath: 'inexistent'
        }).toGraphQL()
        expect(result).matchSnapshot()
    })
})
