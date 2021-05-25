import distDirPath from './distDirPath'
import libDirPath from './libDirPath'
import moduleDirs from './moduleDirs'
import { Module } from './modules'

const getDistDir = (
  sourceModule: Module,
  targetModules: Set<Module>,
  module: Module = 'CommonJS'
): string =>
  sourceModule === 'ESModules'
    ? targetModules.has('CommonJS')
      ? targetModules.has('ESModules')
        ? `${distDirPath}/${moduleDirs[module]}`
        : distDirPath
      : libDirPath
    : libDirPath

export default getDistDir
