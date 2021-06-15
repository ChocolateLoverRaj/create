import never from 'never'
import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import getPackageFromVersion from '../../getPackageFromVersion'
import standardPackage from '../../standardPackage'
import promptCodeLint from '../prompts/promptCodeLint'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import eslintConfigFile from '../../eslintConfigFile'
import promptTypeScript from '../prompts/promptTypeScript'
import tsStandardPackage from '../../tsStandardPackage'
import { Test } from '../../tests'
import promptTests from '../prompts/promptTests'
import { writeFile } from 'jsonfile'

const eslintTsconfigPath = 'eslintTsconfig.json'

const standard: Task<void, [CodeLint, PackageJsonEditor, boolean, Test]> = {
  dependencies: [promptCodeLint, packageJsonTask, promptTypeScript, promptTests],
  fn: async (codeLint, { data, beforeWrite }, ts, test) => {
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
      })(), writeFile(eslintConfigFile, {
        root: true,
        extends: ts ? 'standard-with-typescript' : 'standard',
        ignorePatterns: '/dist',
        parserOptions: ts
          ? {
              project: test === 'mocha' ? `./${eslintTsconfigPath}` : './tsconfig.json'
            }
          : undefined
      }, { spaces: 2 }), ts && test === 'mocha' && writeFile(eslintTsconfigPath, {
        extends: './tsconfig.json',
        include: '**/*.ts'
      }, { spaces: 2 }))
    }
  }
}

export default standard
