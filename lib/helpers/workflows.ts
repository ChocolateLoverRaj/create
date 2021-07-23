const workflows = ['lint', 'test'] as const

export type Workflow = typeof workflows[number]

export default workflows
