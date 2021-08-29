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
import { copyFile } from 'fs/promises'
import { join } from 'path'
import resPath from '../../resPath'

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
        : targetModules.has('ESModules') && !ts
          ? 'node --experimental-vm-modules ./node_modules/jest/bin/jest'
          : 'jest'
    })

    const packageVersions: { [K in Exclude<Test, 'none'>]: string } = {
      mocha: '8.4.0',
      jest: '27.0.6'
    }

    const jestConfigPath = 'jest.config.js'

    beforeWrite.push((async () => {
      Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
        [test]: `^${await getLatestPackageVersion(test, packageVersions[test])}`
      })
    })(), ts && (async () => {
      Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
        [`@types/${test}`]: `^${await getLatestPackageVersion(`@types/${test}`,
          `<=${major(packageVersions[test])}.${minor(packageVersions[test])}`)}`
      })
    })(), ts && test === 'jest' && (async () => {
      // Use ts-jest
      await Promise.all([
        (async () => {
          Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
            'ts-jest': `^${await getLatestPackageVersion('ts-jest', '^27.0.3')}`
          })
        })(),
        copyFile(join(resPath, 'jestTsConfig.js'), jestConfigPath)
      ])
    })(), !ts && sourceModule === 'ESModules' && !targetModules.has('ESModules') && (async () => {
      // Use babel-jest
      await Promise.all([
        (async () => {
          Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
            'babel-jest': `^${await getLatestPackageVersion('babel-jest', '^27.1.0')}`
          })
        })(),
        copyFile(join(resPath, 'jestBabelConfig.js'), jestConfigPath)
      ])
    })())
  }
}

export default testsTask
