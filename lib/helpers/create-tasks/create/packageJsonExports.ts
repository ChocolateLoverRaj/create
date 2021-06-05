import { Task } from '../../dependency-queue'
import distDirPath from '../../distDirPath'
import getDistDir from '../../getDistDir'
import getMainFileName from '../../mainFileNameJs'
import moduleDirs from '../../moduleDirs'
import { Module } from '../../modules'
import { Test } from '../../tests'
import promptSourceModule from '../prompts/promptSourceModule'
import promptTargetModules from '../prompts/promptTargetModules'
import promptTests from '../prompts/promptTests'
import promptTypeScript from '../prompts/promptTypeScript'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonExports: Task<void, [PackageJsonEditor, Set<Module>, Module, Test, boolean]> = {
  dependencies: [
    packageJsonTask,
    promptTargetModules,
    promptSourceModule,
    promptTests,
    promptTypeScript
  ],
  fn: (packageJson, targetModules, sourceModule, test, ts) => {
    if (targetModules.has('ESModules') && !targetModules.has('CommonJS')) {
      packageJson.data.type = 'module'
    }
    const cjsDistDir = getDistDir({ sourceModule, targetModules, test, ts })
    packageJson.data.main = `${cjsDistDir}/${getMainFileName}`
    if (targetModules.has('CommonJS') && targetModules.has('ESModules')) {
      packageJson.data.exports = {
        '.': {
          import: `./${distDirPath}/${moduleDirs.ESModules}/${getMainFileName}`,
          require: `./${distDirPath}/${moduleDirs.CommonJS}/${getMainFileName}`
        }
      }
    }
  }
}

export default packageJsonExports
