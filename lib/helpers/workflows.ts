const workflows = ['lint', 'test', 'release', 'docs'] as const

export type Workflow = typeof workflows[number]

export default workflows
