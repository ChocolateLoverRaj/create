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
import babelCoreVersion from '../../babelCoreVersion'
import babelCliVersion from '../../babelCliVersion'
import resolvePackageVersions from '../../../resolvePackageVersions'
import promptReact from '../prompts/promptReact'
import promptDocs, { Docs } from '../prompts/promptDocs'
import babelConfigPaths from '../../babelConfigPaths'
import { Test } from '../../tests'
import promptTests from '../prompts/promptTests'
import writeBabelConfig from '../../writeBabelConfig'

const babelCorePackages = {
  '@babel/core': babelCoreVersion,
  '@babel/cli': babelCliVersion
}

const babelTransformModulesPackages = {
  '@babel/plugin-transform-modules-commonjs': '^7.14.0'
}

const babelReactPackages = {
  ...babelCorePackages,
  '@babel/preset-typescript': '^7.15.0',
  'babel-plugin-react-require': '^3.1.3',
  ...babelTransformModulesPackages,
  '@babel/preset-react': '^7.14.5'
}

const esmBabelConfigPath = join(resPath, 'esmBabelConfig.json')

const transpileModules: Task<
void, [Module, Set<Module>, PackageJsonEditor, boolean, boolean, Docs, Test]> = {
  dependencies: [
    promptSourceModule,
    promptTargetModules,
    packageJsonTask,
    promptTypeScript,
    promptReact,
    promptDocs,
    promptTests
  ],
  fn: (sourceModule, targetModules, packageJson, ts, react, docs, tests) => {
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
      if (react) {
        packageJson.beforeWrite.push((async () => {
          Object.assign(data.devDependencies ?? (data.devDependencies = {}),
            await resolvePackageVersions(babelCorePackages))
        })(), (async () => {
          const getBuildCommand = (module?: Module): string => {
            const ignore: string[] = []
            if (docs === Docs.STORYBOOK) ignore.push('**/*.stories.tsx')
            if (tests === 'jest') ignore.push('**/__tests__')
            return [
              'babel',
              ...module !== undefined ? ['--config-file', `./${babelConfigPaths[module]}`] : [],
              libDirPath,
              '--out-dir',
              getDistDir({ sourceModule, targetModules, ts, module }),
              '--extensions',
              '".tsx"',
              ...ignore.length > 0 ? ['--ignore', ignore.toString()] : []
            ].join(' ')
          }
          if (targetModules.size > 1) {
            targetModules.forEach(module => {
              scripts[module] = getBuildCommand(module)
            })
            await Promise.all<unknown>([
              Object.assign(
                packageJson.data.devDependencies ?? (packageJson.data.dependencies = {}),
                await resolvePackageVersions({
                  ...babelReactPackages,
                  ...babelTransformModulesPackages
                })),
              ...[...targetModules].map(async targetModule => await writeBabelConfig(targetModule))
            ])
          } else {
            const targetModule: Module = targetModules.keys().next().value
            scripts[targetModule] = getBuildCommand()
            await Promise.all([
              Object.assign(
                packageJson.data.devDependencies ?? (packageJson.data.dependencies = {}),
                await resolvePackageVersions({
                  ...babelReactPackages,
                  ...targetModule === 'CommonJS' ? babelTransformModulesPackages : undefined
                })),
              writeBabelConfig(targetModule, true)
            ])
          }
        })())
      } else {
        const getScript = (targetModule: Module): string => targetModules.size !== 1
          ? `tsc --project ${tsconfigPaths[targetModule]}`
          : 'tsc'
        if (targetModules.has('CommonJS')) scripts.CommonJS = getScript('CommonJS')
        if (targetModules.has('ESModules')) scripts.ESModules = getScript('ESModules')
      }
      addScripts(scripts)
    } else if (getTransformModules(targetModules, sourceModule)) {
      const esmDistDir = getDistDir({ sourceModule, targetModules, module: 'ESModules' })
      addScripts({
        CommonJS: `babel ${libDirPath} --out-dir ${getDistDir({ sourceModule, targetModules })}`,
        ESModules: `cpy ${libDirPath} ${esmDistDir}`
      })
      packageJson.beforeWrite.push((async () => Object.assign(
        data.devDependencies ?? (data.devDependencies = {}),
        {
          ...await resolvePackageVersions({
            ...babelCorePackages,
            ...babelTransformModulesPackages
          }),
          ...targetModules.has('ESModules') && {
            'cpy-cli': '^3.1.1'
          }
        }
      ))(), (async () => {
        const babelConfig = await readFile(esmBabelConfigPath)
        delete babelConfig.$schema
        await writeFile('.babelrc', babelConfig, { spaces: 2 })
      })())
    }
  }
}

export default transpileModules
