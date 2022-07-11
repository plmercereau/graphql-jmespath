import { Expression, getIntrospectionSchema } from 'graphql-jmespath'
const expression =
    "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

import { request } from 'graphql-request'
import { useState } from 'react'

const exp = new Expression(expression)
const API = 'https://countries.trevorblades.com/'

getIntrospectionSchema(API).then((schema) => {
    const e = new Expression('*[].{name:name}', { schema })
    const query = e.toGraphQL({ pretty: true })
    request(API, query).then((res) => {
        console.log(res)
        console.log(e.search(res))
    })
})

function App() {
    const [result, setResult] = useState()
    return (
        <div>
            <h2>{expression}</h2>
            {/* <pre>{exp.toGraphQL({ pretty: true })}</pre> */}
            <button
                onClick={async () => {
                    setResult(undefined)
                    const data = await request(API, exp.toGraphQL())
                    setResult(exp.search(data))
                }}
            >
                Fetch
            </button>
            <button onClick={async () => {}}>Get schema</button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    )
}

export default App
