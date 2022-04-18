import { Expression } from '../Expression'

// TODO browse the following
/*
functions
pipe
wildcard
current @


https://jmespath.org/examples.html

people[?age > `20`].[name, age]
people[?age > `20`].{name: name, age: age}
people[*].{name: name, tags: tags[0]}
people[?general.id==`100`].general | [0]
people[?general.id==`100`] | [0].general
sort_by(Contents, &Date)[*].{Key: Key, Size: Size}
locations[?state == 'WA'].name | sort(@)[-2:] | {WashingtonCities: join(', ', @)}

*/

export const todo: Expression[] = []
