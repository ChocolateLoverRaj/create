import { Task } from '../../dependency-queue'
import distDirPath from '../../distDirPath'
import getDistDir from '../../getDistDir'
import getLatestPackageVersion from '../../getLatestPackageVersion'
import { Module } from '../../modules'
import { Test } from '../../tests'
import promptSourceModule from '../prompts/promptSourceModule'
import promptTargetModules from '../prompts/promptTargetModules'
import promptTests from '../prompts/promptTests'
import promptTypeScript from '../prompts/promptTypeScript'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import testDir from './testDir'

const mocha: Task<void, [Test, PackageJsonEditor, boolean, Module, Set<Module>]> = {
  dependencies: [
    promptTests,
    packageJsonTask,
    promptTypeScript,
    promptSourceModule,
    promptTargetModules
  ],
  fn: async (test, { data, beforeWrite }, ts, sourceModule, targetModules) => {
    if (test !== 'mocha') return
    Object.assign(data.scripts ?? (data.scripts = {}), {
      test: ts
        ? `mocha ${distDirPath}/${testDir}`
        : `mocha ${getDistDir({ sourceModule, targetModules })}`
    })
    beforeWrite.push((async () => {
      Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
        mocha: `^${await getLatestPackageVersion('mocha', '^8.4.0')}`,
        '@types/mocha': `^${await getLatestPackageVersion('@types/mocha', '8')}`
      })
    })())
  }
}

export default mocha
