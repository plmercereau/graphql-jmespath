import { createStyles, Navbar as MantineNavbar, Anchor } from '@mantine/core'
import { World, Home } from 'tabler-icons-react'
import { Link, useLocation } from 'react-router-dom'
const { Section } = MantineNavbar
const useStyles = createStyles((theme, _params, getRef) => {
    const icon = getRef('icon')
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${
                theme.colorScheme === 'dark'
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`
        },

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

const data = [
    { to: '/', label: 'Home', Icon: Home },
    { to: '/countries', label: 'Countries', Icon: World }
]

export const Navbar: React.FC = () => {
    const { classes, cx } = useStyles()
    const { pathname } = useLocation()

    const links = data.map(({ to, label, Icon }) => (
        <Anchor
            component={Link}
            className={cx(classes.to, {
                [classes.linkActive]: to === pathname
            })}
            to={to}
            key={label}
        >
            <Icon className={classes.linkIcon} />
            <span>{label}</span>
        </Anchor>
    ))

    return (
        <MantineNavbar height={700} width={{ sm: 300 }} p="md">
            <Section grow>
                {/* <Group className={classes.header} position="apart">
                    <MantineLogo />
                    <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
                </Group> */}

                {links}
            </Section>

            {/* <Section className={classes.footer}>
                <a
                    href="#"
                    className={classes.link}
                    onClick={(event) => event.preventDefault()}
                >
                    <SwitchHorizontal className={classes.linkIcon} />
                    <span>Change account</span>
                </a>

                <a
                    href="#"
                    className={classes.link}
                    onClick={(event) => event.preventDefault()}
                >
                    <Logout className={classes.linkIcon} />
                    <span>Logout</span>
                </a>
            </Section> */}
        </MantineNavbar>
    )
}
