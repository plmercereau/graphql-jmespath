import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

export type ChartConfig = {
    type: 'bar'
    valueKey: string
    xKey: string
}

const CHART_TYPES = {
    bar: {
        Chart: BarChart,
        Data: Bar
    }
}
export const ChartResult: React.FC<
    {
        value: any
    } & ChartConfig
> = ({ value, type, valueKey, xKey }) => {
    if (!value) return null
    const { Chart, Data } = CHART_TYPES[type]
    return (
        <ResponsiveContainer width="100%" height={400}>
            <Chart data={value}>
                <Data dataKey={valueKey} fill="#1B7ED6" />
                <XAxis dataKey={xKey} />
                <Tooltip />
            </Chart>
        </ResponsiveContainer>
    )
}
