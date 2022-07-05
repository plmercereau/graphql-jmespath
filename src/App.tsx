import { jmespathToGraphQL } from './lib'
const expression =
    "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

import { request } from 'graphql-request'
import { useState } from 'react'
import { search } from 'jmespath'

const query = jmespathToGraphQL(expression)
const API = 'https://countries.trevorblades.com/'
function App() {
    const [result, setResult] = useState()
    return (
        <div>
            <h2>{expression}</h2>
            <pre>{query}</pre>
            <button
                onClick={async () => {
                    setResult(undefined)
                    const data = await request(API, query)
                    setResult(search(data, expression))
                }}
            >
                Fetch
            </button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    )
}

export default App
