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

const standardConfigPath = join(resPath, 'standardConfig.json')

const standard: Task<void, [CodeLint, PackageJsonEditor]> = {
  dependencies: [promptCodeLint, packageJsonTask],
  fn: async (codeLint, { data, beforeWrite }) => {
    if (codeLint === 'standard') {
      beforeWrite.push((async () => {
        const eslintStandardPackage = await getPackageFromVersion(standardPackage)
        const eslintStandardPackageVersion =
          eslintStandardPackage.version ?? never('no eslint-config-standard version')
        Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
          ...eslintStandardPackage.peerDependencies,
          [standardPackage]: `^${eslintStandardPackageVersion}`
        })
      })(), copyFile(standardConfigPath, eslintConfigFile))
    }
  }
}

export default standard
