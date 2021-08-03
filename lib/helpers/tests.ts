const tests = ['none', 'mocha', 'jest'] as const

export type Test = typeof tests[number]

export default tests
