import distDirPath from './distDirPath'
import libDirPath from './libDirPath'
import moduleDirs from './moduleDirs'
import { Module } from './modules'

const getCjsDir = (sourceModule: Module, targetModules: Set<Module>): string =>
  sourceModule === 'ESModules'
    ? targetModules.has('CommonJS')
      ? targetModules.has('ESModules')
        ? `${distDirPath}/${moduleDirs.CommonJS}`
        : distDirPath
      : libDirPath
    : libDirPath

export default getCjsDir
