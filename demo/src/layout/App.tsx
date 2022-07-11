import { Grid, Container } from '@mantine/core'
import { Outlet } from 'react-router-dom'

import { Navbar } from './Navbar'
import { Header } from './Header'
// import { Footer } from './Footer'

export const App: React.FC = () => {
    return (
        <Container>
            <Header />
            <Grid>
                <Grid.Col span={4}>
                    <Navbar />
                </Grid.Col>
                <Grid.Col span={8}>
                    <Outlet />
                </Grid.Col>
            </Grid>
            {/* <Footer /> */}
        </Container>
    )
}
