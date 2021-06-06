const projectTypes = ['runFile', 'package', 'ghAction'] as const

export type ProjectType = typeof projectTypes[number]

export default projectTypes
