import { Expression } from 'graphql-jmespath'
import Highlight, { defaultProps } from 'prism-react-renderer'
import github from 'prism-react-renderer/themes/github'

export const Result: React.FC<{ expression: Expression; data: any }> = ({
    expression,
    data
}) => {
    if (!data) return null
    const result = expression.search(data)
    if (!result) return null
    return (
        <Highlight
            {...defaultProps}
            theme={github}
            language={'json'}
            code={JSON.stringify(result, null, 2)}
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    )
}
