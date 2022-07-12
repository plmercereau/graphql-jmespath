import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { App } from './layout/App'
import { Home } from './Home'
import { examples } from './examples'
import { ExpressionForm } from './components/ExpressionForm'

import { paramCase } from 'param-case'

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    {examples.map((props) => (
                        <Route
                            key={props.title}
                            path={paramCase(props.title)}
                            element={<ExpressionForm {...props} />}
                        />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)
