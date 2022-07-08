import fs from 'fs'
import path from 'path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

const PWD = process.env.PWD
const pkg = require(path.join(PWD, 'package.json'))

const tsEntry = path.resolve(PWD, 'src/index.ts')
const entry = fs.existsSync(tsEntry) ? tsEntry : tsEntry.replace('.ts', '.tsx')

const deps = [
    ...Object.keys(Object.assign({}, pkg.peerDependencies, pkg.dependencies))
]

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        dts({
            exclude: ['**/*.spec.ts', '**/*.test.ts', '**/tests/**'],
            afterBuild: () => {
                const types = fs.readdirSync(path.join(PWD, 'dist/src'))
                types.forEach((file) => {
                    fs.renameSync(
                        path.join(PWD, 'dist/src', file),
                        path.join(PWD, 'dist', file)
                    )
                })
                fs.rmdirSync(path.join(PWD, 'dist/src'))
            }
        })
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        reporters: 'verbose',
        include: [
            `${PWD}/src/**/*.{spec,test}.{ts,tsx}`,
            `${PWD}/tests/**/*.{spec,test}.{ts,tsx}`
        ],
        // Note: temporarily disabled threads, because of a bug in vitest
        // https://github.com/vitest-dev/vitest/issues/1171
        threads: false,
        coverage: {
            enabled: process.env.CI === 'true',
            reporter: ['json']
        }
    },
    build: {
        sourcemap: true,
        lib: {
            entry,
            name: pkg.name,
            fileName: (format) =>
                format === 'cjs' ? `index.cjs.js` : `index.esm.js`,
            formats: ['cjs', 'es']
        },
        rollupOptions: {
            external: (id) => deps.some((dep) => id.startsWith(dep)),
            output: {
                globals: {
                    graphql: 'graphql',
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': '_jsx'
                }
            }
        }
    }
})
