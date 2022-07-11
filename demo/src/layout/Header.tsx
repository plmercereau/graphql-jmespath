import { useState } from 'react'
import {
    createStyles,
    Header as MantineHeader,
    Container,
    Group,
    Button
} from '@mantine/core'
import { BrandGithub } from 'tabler-icons-react'
// import { MantineLogo } from '../../shared/MantineLogo';

const useStyles = createStyles((theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none'
        }
    },

    burger: {
        [theme.fn.largerThan('xs')]: {
            display: 'none'
        }
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
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor:
                theme.colorScheme === 'dark'
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0],
            color: theme.colors[theme.primaryColor][
                theme.colorScheme === 'dark' ? 3 : 7
            ]
        }
    }
}))

const links: Array<{ link: string; label: string }> = []
export const Header: React.FC = () => {
    const [active, setActive] = useState('')
    const { classes, cx } = useStyles()

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={cx(classes.link, {
                [classes.linkActive]: active === link.link
            })}
            onClick={(event) => {
                event.preventDefault()
                setActive(link.link)
            }}
        >
            {link.label}
        </a>
    ))

    return (
        <MantineHeader height={60}>
            <Container className={classes.header}>
                {/* <MantineLogo /> */}
                <Group spacing={5} className={classes.links}>
                    <Button
                        leftIcon={<BrandGithub />}
                        variant="outline"
                        color={'dark'}
                        component="a"
                        href="https://github.com/plmercereau/graphql-jmespath"
                        target="_blank"
                    >
                        GitHub
                    </Button>
                    {items}
                </Group>
            </Container>
        </MantineHeader>
    )
}
