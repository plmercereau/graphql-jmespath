import { Prism } from '@mantine/prism'

export const JsonResult: React.FC<{ value: any }> = ({ value }) => {
    if (!value) return null
    return <Prism language="json">{JSON.stringify(value, null, 2)}</Prism>
}
