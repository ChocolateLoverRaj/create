const codeLints = ['none', 'standard'] as const

export type CodeLint = typeof codeLints[number]

export default codeLints
