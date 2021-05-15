import { CodeLint } from './codeLints'
import { join } from 'path'
import { copyFile } from 'fs/promises'
import resPath from './resPath'
import eslintConfigFile from './eslintConfigFile'

const standardConfigPath = join(resPath, 'standardConfig.json')

const createEslintConfig = async (codeLint: CodeLint): Promise<void> => {
  if (codeLint === 'standard') await copyFile(standardConfigPath, eslintConfigFile)
}

export default createEslintConfig
