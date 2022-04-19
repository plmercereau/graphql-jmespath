import { Expression } from '../Expression'

// TODO browse the following
/*
functions
wildcard
current @
@
@.bar
@.foo[0]

"*[?[0] == `0`]""



https://jmespath.org/examples.html

sort_by(Contents, &Date)[*].{Key: Key, Size: Size}
locations[?state == 'WA'].name | sort(@)[-2:] | {WashingtonCities: join(', ', @)}

*/

export const todo: Expression[] = []
