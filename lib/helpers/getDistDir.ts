import distDirPath from './distDirPath'
import getTransformModules from './getTransformModules'
import libDirPath from './libDirPath'
import moduleDirs from './moduleDirs'
import { Module } from './modules'
import { Test } from './tests'

interface Options {
  sourceModule: Module
  targetModules: Set<Module>
  test?: Test
  module?: Module
  ts?: boolean
}

const getDistDir = ({
  sourceModule,
  targetModules,
  test = 'none',
  module = 'CommonJS',
  ts = false
}: Options): string =>
  sourceModule === 'ESModules'
    ? targetModules.has('CommonJS')
      ? targetModules.has('ESModules')
        ? `${distDirPath}/${moduleDirs[module]}`
        : test === 'mocha' && getTransformModules(targetModules, sourceModule)
          ? `${distDirPath}/${libDirPath}`
          : distDirPath
      : libDirPath
    : libDirPath

export default getDistDir
