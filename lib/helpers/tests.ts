const tests = ['none', 'mocha'] as const

export type Test = typeof tests[number]

export default tests
