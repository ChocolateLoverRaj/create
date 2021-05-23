import pathExists from 'path-exists'
import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import eslintConfigFile from '../../eslintConfigFile'
import promptReplaceFile from '../../promptReplaceFile'
import promptCodeLint from './promptCodeLint'

const shouldWriteEslintConfig: Task<Promise<boolean>, [CodeLint]> = {
  dependencies: [promptCodeLint],
  fn: async codeLint => {
    const eslintConfigExists = await pathExists(eslintConfigFile)
    if (codeLint === 'standard' && eslintConfigExists)console.log(`Detected ${eslintConfigFile}`)
    return !eslintConfigExists || await promptReplaceFile(eslintConfigFile)
  }
}

export default shouldWriteEslintConfig
