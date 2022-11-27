import {
    MantineProvider,
    createStyles,
    Header,
    Container,
    Group,
    AppShell
} from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { Playground } from './Playground'

const useStyles = createStyles((theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0]
        }
    }
}))

function App() {
    const { classes } = useStyles()

    const colorScheme = useColorScheme()
    return (
        <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
        >
            <AppShell
                padding="md"
                header={
                    <Header height={60} mb={120}>
                        <Container className={classes.header}>
                            <div>GraphQL JMESPath Playground</div>
                            <Group spacing={5}>
                                <a
                                    href="https://github.com/plmercereau/graphql-jmespath"
                                    className={classes.link}
                                    target="_blank"
                                >
                                    GitHub
                                </a>
                            </Group>
                        </Container>
                    </Header>
                }
                styles={(theme) => ({
                    main: {
                        backgroundColor:
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[8]
                                : theme.colors.gray[0]
                    }
                })}
            >
                <Playground />
            </AppShell>
        </MantineProvider>
    )
}

export default App
