import { JmespathComparator } from 'jmespath'
export type WhereArgumentPath = (initialPath: string, subPath: string, comparator: JmespathComparator) => string