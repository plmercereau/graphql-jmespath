declare module 'jmespath' {
    export type ObjectType = any // TODO

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
