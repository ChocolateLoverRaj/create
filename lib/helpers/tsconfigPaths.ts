import { Module } from './modules'

const tsconfigPaths: Record<Module, string> = {
  CommonJS: 'tsconfigCjs.json',
  ESModules: 'tsconfigEsm.json'
}

export default tsconfigPaths
