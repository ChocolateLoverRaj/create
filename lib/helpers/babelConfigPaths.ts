import { Module } from './modules'

const babelConfigPaths: Record<Module, string> = {
  CommonJS: 'babelConfigCjs.json',
  ESModules: 'babelConfigEsm.json'
}

export default babelConfigPaths
