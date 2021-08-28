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
import { major, minor } from 'semver'

const testsTask: Task<void, [Test, PackageJsonEditor, boolean, Module, Set<Module>]> = {
  dependencies: [
    promptTests,
    packageJsonTask,
    promptTypeScript,
    promptSourceModule,
    promptTargetModules
  ],
  fn: async (test, { data, beforeWrite }, ts, sourceModule, targetModules) => {
    if (test === 'none') return
    Object.assign(data.scripts ?? (data.scripts = {}), {
      test: test === 'mocha'
        ? ts
          ? `mocha ${distDirPath}/${testDir}`
          : `mocha ${getDistDir({ sourceModule, targetModules })}`
        : 'jest'
    })

    const packageVersions: { [K in Exclude<Test, 'none'>]: string } = {
      mocha: '8.4.0',
      jest: '27.0.6'
    }

    beforeWrite.push((async () => {
      Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
        [test]: `^${await getLatestPackageVersion(test, packageVersions[test])}`
      })
    })(), ts && (async () => {
      Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
        [`@types/${test}`]: `^${await getLatestPackageVersion(`@types/${test}`,
          `<=${major(packageVersions[test])}.${minor(packageVersions[test])}`)}`
      })
    })())
  }
}

export default testsTask
