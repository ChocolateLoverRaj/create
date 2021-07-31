const workflows = ['lint', 'test', 'release'] as const

export type Workflow = typeof workflows[number]

export default workflows
