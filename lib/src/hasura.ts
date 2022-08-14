import { JmespathComparator } from 'jmespath'
import { WhereArgumentPath } from './arguments'
import { Options } from './tranformer'

const HASURA_COMPARATORS: Record<JmespathComparator, string> = {
    EQ: '_eq',
    NE: '_neq',
    GT: '_gt',
    GTE: '_gte',
    LT: '_lt',
    LTE: '_lte'
}

// TODO multiple entries with Vite (and package.json?). Make import work with:
/*
 import { whereArgumentPath } from 'graphql-jmespath/hasura'
 import { options } from 'graphql-jmespath/hasura'
 */
export const whereArgumentPath: WhereArgumentPath = (
    initialPath,
    subPath,
    comparator
) => `${initialPath}.__args.where.${subPath}.${HASURA_COMPARATORS[comparator]}`

export const options: Options = {
    whereArgumentPath
}
