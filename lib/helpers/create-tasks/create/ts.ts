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

const ts: Task<void, [boolean, PackageJsonEditor, Set<Module>]> = {
  dependencies: [promptTypeScript, packageJsonTask, promptTargetModules],
  fn: async (ts, packageJson, targetModules) => {
    if (!ts) return
    const { data } = packageJson
    data.types = `./${distDirPath}/${moduleDirs.ESModules}/index.d.ts`
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
        include: [`./${libDirPath}`],
        compilerOptions: {
          outDir: `./${distDirPath}`,
          rootDir: `./${libDirPath}`,
          esModuleInterop: false,
          strictNullChecks: true,
          importHelpers: true,
          module: targetModules.size === 1
            ? tsModules[targetModules.values().next().value]
            : undefined,
          declaration: true
        }
      }, { spaces: 2 }),
      ...targetModules.size !== 1
        ? [...targetModules].map(async targetModule => {
            await writeFile(tsconfigPaths[targetModule], {
              extends: './tsconfig.json',
              compilerOptions: {
                module: tsModules[targetModule],
                outDir: `./${distDirPath}/${moduleDirs[targetModule]}`
              }
            }, { spaces: 2 })
          })
        : []
    ])
  }
}

export default ts
