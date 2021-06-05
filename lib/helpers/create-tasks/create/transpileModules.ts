import { Task } from '../../dependency-queue'
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
import promptTypeScript from '../prompts/promptTypeScript'
import tsconfigPaths from '../../tsconfigPaths'
import getLatestPackageVersion from '../../getLatestPackageVersion'

const babelPackages: Array<[string, string]> = [
  ['@babel/core', '^7.14.2'],
  ['@babel/cli', '^7.13.16'],
  ['@babel/plugin-transform-modules-commonjs', '^7.14.0']
]

const esmBabelConfigPath = join(resPath, 'esmBabelConfig.json')

const transpileModules: Task<void, [Module, Set<Module>, PackageJsonEditor, boolean]> = {
  dependencies: [promptSourceModule, promptTargetModules, packageJsonTask, promptTypeScript],
  fn: (sourceModule, targetModules, packageJson, ts) => {
    const { data } = packageJson
    const addScripts = (scripts: Partial<Record<Module, string>>): void => {
      Object.assign(
        data.scripts ?? (data.scripts = {}),
        targetModules.has('ESModules') && targetModules.has('CommonJS')
          ? {
              'build:cjs': scripts.CommonJS,
              'build:esm': scripts.ESModules,
              build: 'npm run build:cjs && npm run build:esm'
            }
          : {
              build: targetModules.has('CommonJS') ? scripts.CommonJS : scripts.ESModules
            }
      )
    }
    if (ts) {
      const scripts: Partial<Record<Module, string>> = {}
      const getScript = (targetModule: Module): string => targetModules.size !== 1
        ? `tsc --project ${tsconfigPaths[targetModule]}`
        : 'tsc'
      if (targetModules.has('CommonJS')) scripts.CommonJS = getScript('CommonJS')
      if (targetModules.has('ESModules')) scripts.ESModules = getScript('ESModules')
      addScripts(scripts)
    } else if (getTransformModules(targetModules, sourceModule)) {
      const esmDistDir = getDistDir({ sourceModule, targetModules, module: 'ESModules' })
      addScripts({
        CommonJS: `babel ${libDirPath} --out-dir ${getDistDir({ sourceModule, targetModules })}`,
        ESModules: `cpy ${libDirPath} ${esmDistDir}`
      })
      packageJson.beforeWrite.push((async () => {
        const devDeps =
          babelPackages.map<Promise<[string, string]>>(async ([packageName, range]) => [
            packageName,
            await getLatestPackageVersion(packageName, range)
          ])
        if (targetModules.has('ESModules')) {
          devDeps.push((async (): Promise<[string, string]> => [
            'cpy-cli',
            await getLatestPackageVersion('cpy-cli', '^3.1.1')
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
