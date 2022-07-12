import {
    Text,
    AppShell,
    Navbar,
    Header,
    Burger,
    MediaQuery,
    useMantineTheme,
    Anchor,
    createStyles,
    Button,
    Group,
    MantineProvider,
    ColorScheme,
    ColorSchemeProvider,
    ActionIcon,
    Container,
    SimpleGrid,
    Grid
} from '@mantine/core'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { paramCase } from 'param-case'

import { useState } from 'react'
import { BrandGithub, Home, MoonStars, Sun } from 'tabler-icons-react'
import { useLocalStorage } from '@mantine/hooks'
import { examples } from '../examples'

const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon')
    return {
        to: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[1]
                    : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor:
                    theme.colorScheme === 'dark'
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color:
                        theme.colorScheme === 'dark' ? theme.white : theme.black
                }
            }
        },

        linkIcon: {
            ref: icon,
            color:
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[2]
                    : theme.colors.gray[6],
            marginRight: theme.spacing.sm
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor:
                    theme.colorScheme === 'dark'
                        ? theme.fn.rgba(
                              theme.colors[theme.primaryColor][8],
                              0.25
                          )
                        : theme.colors[theme.primaryColor][0],
                color:
                    theme.colorScheme === 'dark'
                        ? theme.white
                        : theme.colors[theme.primaryColor][7],
                [`& .${icon}`]: {
                    color: theme.colors[theme.primaryColor][
                        theme.colorScheme === 'dark' ? 5 : 7
                    ]
                }
            }
        }
    }
})

export const App: React.FC = () => {
    const theme = useMantineTheme()
    const [opened, setOpened] = useState(false)
    const { classes, cx } = useStyles()
    const { pathname } = useLocation()

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue:
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
    })

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{ colorScheme }}
                withGlobalStyles
                withNormalizeCSS
            >
                <AppShell
                    styles={{
                        main: {
                            background:
                                colorScheme === 'dark'
                                    ? theme.colors.dark[8]
                                    : theme.colors.gray[0]
                        }
                    }}
                    navbarOffsetBreakpoint="sm"
                    asideOffsetBreakpoint="sm"
                    fixed
                    navbar={
                        <Navbar
                            p="md"
                            hiddenBreakpoint="sm"
                            hidden={!opened}
                            width={{ sm: 200, lg: 300 }}
                        >
                            <Navbar.Section grow>
                                <Anchor
                                    component={Link}
                                    className={cx(classes.to, {
                                        [classes.linkActive]: pathname === '/'
                                    })}
                                    to="/"
                                    key="home"
                                    onClick={() => setOpened(false)}
                                >
                                    <Home className={classes.linkIcon} />
                                    <span>Home</span>
                                </Anchor>
                                {examples.map(({ title, Icon }) => (
                                    <Anchor
                                        component={Link}
                                        className={cx(classes.to, {
                                            [classes.linkActive]:
                                                `/${paramCase(title)}` ===
                                                pathname
                                        })}
                                        to={paramCase(title)}
                                        key={paramCase(title)}
                                        onClick={() => setOpened(false)}
                                    >
                                        {Icon && (
                                            <Icon
                                                className={classes.linkIcon}
                                            />
                                        )}
                                        <span>{title}</span>
                                    </Anchor>
                                ))}
                            </Navbar.Section>
                        </Navbar>
                    }
                    // footer={
                    //     <Footer height={60} p="md">
                    //         Application footer
                    //     </Footer>
                    // }
                    header={
                        <Header
                            height={70}
                            p="md"
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <MediaQuery
                                largerThan="sm"
                                styles={{ display: 'none' }}
                            >
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="xl"
                                />
                            </MediaQuery>

                            <Group style={{ width: '100%' }} position="apart">
                                <Text>GraphQL JMESPath demo</Text>

                                <Group>
                                    <Button
                                        size="xs"
                                        leftIcon={<BrandGithub />}
                                        variant="outline"
                                        color={
                                            colorScheme === 'dark'
                                                ? 'light'
                                                : 'dark'
                                        }
                                        component="a"
                                        href="https://github.com/plmercereau/graphql-jmespath"
                                        target="_blank"
                                    >
                                        GitHub
                                    </Button>
                                    <ActionIcon
                                        variant="outline"
                                        color={
                                            colorScheme === 'dark'
                                                ? 'yellow'
                                                : 'blue'
                                        }
                                        onClick={() => toggleColorScheme()}
                                        title="Toggle color scheme"
                                    >
                                        {colorScheme === 'dark' ? (
                                            <Sun size={18} />
                                        ) : (
                                            <MoonStars size={18} />
                                        )}
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Header>
                    }
                >
                    <Outlet />
                </AppShell>
            </MantineProvider>
        </ColorSchemeProvider>
    )
}
