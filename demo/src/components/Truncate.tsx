import { Alert } from '@mantine/core'
import prettyBytes from 'pretty-bytes'
import React from 'react'

type Props<C> = {
    component: React.ComponentType<C>
    value?: string
    limit?: number
}

export const Truncate = <C extends {}>(
    props: Props<C> & Omit<C, 'children'>
) => {
    const { value, limit = 5000, component, ...componentProps } = props
    if (!value) return null
    const size = value.length
    return (
        <>
            {size > limit && (
                <Alert>
                    Result size is {prettyBytes(size)}. Truncated to the first{' '}
                    {prettyBytes(limit)}.
                </Alert>
            )}
            {React.createElement(component, {
                ...(componentProps as unknown as C),
                children: value.substring(0, limit)
            })}
        </>
    )
}
