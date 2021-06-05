import { Task } from '../../dependency-queue'
import promptTypeScript from '../prompts/promptTypeScript'
import { writeFile } from 'jsonfile'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import distDirPath from '../../distDirPath'
import moduleDirs from '../../moduleDirs'
import libDirPath from '../../libDirPath'
import getLatestPackage from '../../getLatestPackage'
import never from 'never'
import { Module } from '../../modules'
import promptTargetModules from '../prompts/promptTargetModules'
import tsModules from '../../tsModules'
import tsconfigPaths from '../../tsconfigPaths'
import promptTests from '../prompts/promptTests'
import { Test } from '../../tests'

const ts: Task<void, [boolean, PackageJsonEditor, Set<Module>, Test]> = {
  dependencies: [promptTypeScript, packageJsonTask, promptTargetModules, promptTests],
  fn: async (ts, packageJson, targetModules, test) => {
    if (!ts) return
    const { data } = packageJson
    data.types = `./${distDirPath}/${moduleDirs.ESModules}/index.d.ts`
    if (test === 'mocha') {
      Object.assign(data.scripts ?? (data.scripts = {}), {
        'build:test': 'tsc',
        'build:test:watch': 'tsc -w'
      })
    }

    packageJson.beforeWrite.push((async () => {
      const latestTsVersion = (await getLatestPackage('typescript', '^4.3.2'))?.version ??
        never('No typescript version')
      Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
        typescript: `^${latestTsVersion}`
      })
    })(), (async () => {
      const latestTsLibVersion =
        (await getLatestPackage('tslib', '^2.2.0'))?.version ??
        never('No tslib version')
      Object.assign(data.dependencies ?? (data.dependencies = {}), {
        tslib: `^${latestTsLibVersion}`
      })
    })())
    await Promise.all([
      writeFile('tsconfig.json', {
        include: test === 'none' ? [`./${libDirPath}`] : undefined,
        compilerOptions: {
          outDir: `./${distDirPath}`,
          rootDir: test === 'none' ? `./${libDirPath}` : undefined,
          esModuleInterop: false,
          strictNullChecks: true,
          importHelpers: true,
          module: targetModules.size === 1
            ? tsModules[targetModules.values().next().value]
            : test === 'none' ? 'CommonJS' : undefined,
          declaration: true,
          moduleResolution: 'node'
        }
      }, { spaces: 2 }),
      ...targetModules.size !== 1
        ? [...targetModules].map(async targetModule => {
            await writeFile(tsconfigPaths[targetModule], {
              extends: './tsconfig.json',
              compilerOptions: {
                module: tsModules[targetModule],
                outDir: `./${distDirPath}/${moduleDirs[targetModule]}`,
                rootDir: `./${libDirPath}`
              },
              include: [`./${libDirPath}`]
            }, { spaces: 2 })
          })
        : []
    ])
  }
}

export default ts
