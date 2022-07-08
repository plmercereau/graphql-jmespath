import { JMESPathGraphQL } from './lib'
const expression =
    "countries[].{name:name, statesCount: states[].name | length(@), languages:join(', ', languages[].code)} | sort_by(@, &statesCount) | reverse(@) | [:10]"

import { request } from 'graphql-request'
import { useState } from 'react'
import { search } from 'jmespath'
import { getIntrospectionSchema } from './lib'

const exp = new JMESPathGraphQL(expression)
const API = 'https://countries.trevorblades.com/'

getIntrospectionSchema(API).then((schema) => {
    const e = new JMESPathGraphQL('*[].{name:name}', { schema })
    const q = e.toString({ pretty: true })
    console.log(q)
    console.log(schema, schema.getQueryType())
    request(API, q).then((res) => {
        console.log(res)
        console.log(e.search(res))
    })
})

function App() {
    const [result, setResult] = useState()
    return (
        <div>
            <h2>{expression}</h2>
            {/* <pre>{exp.toString({ pretty: true })}</pre> */}
            <button
                onClick={async () => {
                    setResult(undefined)
                    const data = await request(API, exp.toString())
                    setResult(search(data, expression))
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
