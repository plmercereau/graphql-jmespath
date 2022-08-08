declare module 'jmespath' {
    export type ObjectType = any // TODO
    export type JmespathComparator = 'EQ' | 'NE' | 'GT' | 'LT' | 'LTE' | 'GTE'
    //   TODO check type - which properties are optional?
    export type ASTNode = {
        value: any // TODO
        type: string
        name: string
        children: Array<ASTNode>
        jmespathType?: any // TODO
    }

    export function compile(expression: string): ASTNode
    export function search(obj: ObjectType, expression: string): ObjectType
}
