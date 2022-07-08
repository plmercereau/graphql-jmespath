import { it, describe, expect } from 'vitest'
import { JMESPathGraphQL } from '../src/lib'

describe('stop recursing at given paths', () => {
    const expression =
        "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

    it('should stop recursing a single nested path', () => {
        const result = new JMESPathGraphQL(expression, {
            stopAtPath: 'countries.states'
        }).toString()
        expect(result).matchSnapshot()
    })

    it('should stop recursing an array of paths', () => {
        const result = new JMESPathGraphQL(expression, {
            stopAtPath: ['countries.states', 'countries.languages']
        }).toString()
        expect(result).matchSnapshot()
    })

    it('should stop recursing given a stop function', () => {
        const result = new JMESPathGraphQL(expression, {
            stopAtPath: (path) => path === 'countries.states'
        }).toString()
        expect(result).matchSnapshot()
    })

    it('should return the full query when no stopAtPath option is given', () => {
        const result = new JMESPathGraphQL(expression).toString()
        expect(result).matchSnapshot()
    })

    it('should return the full query when the path to stop at does not exists', () => {
        const result = new JMESPathGraphQL(expression, {
            stopAtPath: 'inexistent'
        }).toString()
        expect(result).matchSnapshot()
    })
})
