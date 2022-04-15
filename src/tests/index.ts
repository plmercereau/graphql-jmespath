import { Expression } from '../Expression'
import { doing } from './doing'
import { done } from './done'

export const tests: Expression[] = [...doing, ...done]
