import { Module } from './modules'

const moduleDirs: Record<Module, string> = {
  CommonJS: 'cjs',
  ESModules: 'esm'
}

export default moduleDirs
