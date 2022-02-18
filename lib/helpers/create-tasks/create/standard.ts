import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import standardPackage from '../../standardPackage'
import promptCodeLint from '../prompts/promptCodeLint'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import eslintConfigFile from '../../eslintConfigFile'
import promptTypeScript from '../prompts/promptTypeScript'
import tsStandardPackage from '../../tsStandardPackage'
import { Test } from '../../tests'
import promptTests from '../prompts/promptTests'
import { writeFile } from 'jsonfile'
import promptReact from '../prompts/promptReact'
import resolvePackageVersions from '../../../resolvePackageVersions'
import { join } from 'path'

const eslintTsconfigPath = 'eslintTsconfig.json'

const standard: Task<void, [CodeLint, PackageJsonEditor, boolean, Test, boolean]> = {
  dependencies: [promptCodeLint, packageJsonTask, promptTypeScript, promptTests, promptReact],
  fn: async (codeLint, { data, beforeWrite }, ts, test, react) => {
    if (codeLint === 'standard') {
      beforeWrite.push((async () => {
        const standardPackageToUse = ts ? tsStandardPackage : standardPackage
        Object.assign(data.devDependencies ?? (data.devDependencies = {}),
          await resolvePackageVersions({
            [standardPackageToUse]: '*',
            ...react ? { 'eslint-config-standard-jsx': '*' } : undefined
          }, true))
      })(), writeFile(join(process.cwd(), eslintConfigFile), {
        root: true,
        extends: [
          ts ? 'standard-with-typescript' : 'standard',
          react ? 'standard-jsx' : undefined
        ],
        ignorePatterns: [
          '/dist',
          test === 'jest' ? '**/__snapshots__' : undefined
        ],
        parserOptions: ts
          ? {
              project: test === 'mocha' ? `./${eslintTsconfigPath}` : './tsconfig.json'
            }
          : undefined
      }, { spaces: 2 }), ts && test === 'mocha' && writeFile(
        join(process.cwd(), eslintTsconfigPath), {
          extends: './tsconfig.json',
          include: ['**/*.ts']
        }, { spaces: 2 }))
    }
  }
}

export default standard
