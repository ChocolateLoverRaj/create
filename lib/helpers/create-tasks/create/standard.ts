import never from 'never'
import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import getPackageFromVersion from '../../getPackageFromVersion'
import standardPackage from '../../standardPackage'
import promptCodeLint from '../prompts/promptCodeLint'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import { join } from 'path'
import { copyFile } from 'fs/promises'
import resPath from '../../resPath'
import eslintConfigFile from '../../eslintConfigFile'
import promptTypeScript from '../prompts/promptTypeScript'
import tsStandardPackage from '../../tsStandardPackage'

const standardConfigPath = join(resPath, 'standardConfig.json')
const tsStandardConfigPath = join(resPath, 'tsStandardConfig.json')

const standard: Task<void, [CodeLint, PackageJsonEditor, boolean]> = {
  dependencies: [promptCodeLint, packageJsonTask, promptTypeScript],
  fn: async (codeLint, { data, beforeWrite }, ts) => {
    if (codeLint === 'standard') {
      beforeWrite.push((async () => {
        const standardPackageToUse = ts ? tsStandardPackage : standardPackage
        const eslintStandardPackage =
          await getPackageFromVersion(standardPackageToUse)
        const eslintStandardPackageVersion =
          eslintStandardPackage.version ?? never('no eslint-config-standard version')
        Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
          ...eslintStandardPackage.peerDependencies,
          [standardPackageToUse]: `^${eslintStandardPackageVersion}`
        })
      })(), copyFile(ts ? tsStandardConfigPath : standardConfigPath, eslintConfigFile))
    }
  }
}

export default standard
