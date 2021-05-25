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
import getDistDir from '../../getDistDir'

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
      const buildCjsScript = `babel ${libDirPath} --out-dir ${getDistDir(source, targets)}`
      Object.assign(data.scripts ?? (data.scripts = {}), targets.has('ESModules')
        ? {
            'build:cjs': buildCjsScript,
            'build:esm': `cpy ${libDirPath} ${getDistDir(source, targets, 'ESModules')}`,
            build: 'npm run build:cjs && npm run build:esm'
          }
        : {
            build: buildCjsScript
          })
      packageJson.beforeWrite.push((async () => {
        const devDeps =
          babelPackages.map<Promise<[string, string]>>(async ([packageName, range]) => [
            packageName,
            (await getLatestPackage(packageName, range))?.version ?? never('No package version.')
          ])
        if (targets.has('ESModules')) {
          devDeps.push((async (): Promise<[string, string]> => [
            'cpy-cli',
            (await getLatestPackage('cpy-cli', '^3.1.1'))?.version ?? never('No package version')
          ])())
        }
        Object.assign(
          data.devDependencies ?? (data.devDependencies = {}),
          Object.fromEntries(await Promise.all(devDeps))
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
