const modules = ['CommonJS', 'ESModules'] as const

export type Module = typeof modules[number]

export default modules
