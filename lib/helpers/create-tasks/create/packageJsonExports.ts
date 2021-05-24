import normalizePath from 'normalize-path'
import { Task } from '../../dependency-queue'
import distDirPath from '../../distDirPath'
import getTransformModules from '../../getTransformModules'
import mainFileName from '../../mainFileName'
import mainFilePath from '../../mainFilePath'
import moduleDirs from '../../moduleDirs'
import { Module } from '../../modules'
import promptSourceModule from '../prompts/promptSourceModule'
import promptTargetModules from '../prompts/promptTargetModules'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonExports: Task<void, [PackageJsonEditor, Set<Module>, Module]> = {
  dependencies: [packageJsonTask, promptTargetModules, promptSourceModule],
  fn: (packageJson, targetModules, sourceModule) => {
    if (sourceModule === 'ESModules') packageJson.data.type = 'module'
    packageJson.data.main = getTransformModules(targetModules, sourceModule) 
      ? `${distDirPath}/${moduleDirs.CommonJS}/${mainFileName}`
      : normalizePath(mainFilePath)
    if (targetModules.has('CommonJS') && targetModules.has('ESModules')) {
      packageJson.data.exports = {
        '.': {
          import: `./${distDirPath}/${moduleDirs.CommonJS}/${mainFileName}`,
          require: `./${distDirPath}/${moduleDirs.ESModules}/${mainFileName}`
        }
      }
    }
  }
}

export default packageJsonExports
