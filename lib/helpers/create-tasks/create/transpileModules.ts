import never from 'never'
import { Task } from '../../dependency-queue'
import getLatestPackage from '../../getLatestPackage'
import getTransformModules from '../../getTransformModules'
import { Module } from '../../modules'
import promptSourceModule from '../prompts/promptSourceModule'
import promptTargetModules from '../prompts/promptTargetModules'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import { join } from 'path'
import resPath from '../../resPath'
import { readFile, writeFile } from 'jsonfile'
import libDirPath from '../../libDirPath'
import distDirPath from '../../distDirPath'
import moduleDirs from '../../moduleDirs'

const babelPackages: Array<[string, string]> = [
  ['@babel/core', '^7.14.2'],
  ['@babel/cli', '^7.13.16'],
  ['@babel/plugin-transform-modules-commonjs', '^7.14.0']
]

const esmBabelConfigPath = join(resPath, 'esmBabelConfig.json')

const transpileModules: Task<void, [Module, Set<Module>, PackageJsonEditor]> = {
  dependencies: [promptSourceModule, promptTargetModules, packageJsonTask],
  fn: (source, targets, packageJson) => {
    if (getTransformModules(targets, source)) {
      const { data } = packageJson
      Object.assign(data.scripts ?? (data.scripts = {}), {
        build: `babel ${libDirPath} --out-dir ${distDirPath}/${moduleDirs.ESModules}`
      })
      packageJson.beforeWrite.push((async () => {
        Object.assign(
          data.devDependencies ?? (data.devDependencies = {}),
          Object.fromEntries(await Promise.all(babelPackages.map(async ([packageName, range]) => [
            packageName,
            (await getLatestPackage(packageName, range)).version ?? never('No package version.')
          ])))
        )
      })(), (async () => {
        const babelConfig = await readFile(esmBabelConfigPath)
        delete babelConfig.$schema
        await writeFile('.babelrc', babelConfig, { spaces: 2 })
      })())
    }
  }
}

export default transpileModules
