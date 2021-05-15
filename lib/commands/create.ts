import parseGitConfig, { Config } from 'parse-git-config'
import findGitRoot from 'find-git-root'
import { readFile } from 'fs/promises'
import wrapError from '@calipsa/wrap-error'
import findConfig from 'find-config'
import findLicense from '../helpers/findLicense'
import nullishAnd, { WithUndefined } from '../helpers/nullishAnd'
import exists from 'path-exists'
import promptReplaceFile from '../helpers/promptReplaceFile'
import createPackageJson from '../helpers/createPackageJson'
import createEslintConfig from '../helpers/createEslintConfig'
import eslintConfigFile from '../helpers/eslintConfigFile'
import promptGithubWorkflow from '../helpers/promptGithubWorkflow'
import createLintWorkflow from '../helpers/createLintWorkflow'
import promptBoolean from '../helpers/promptBoolean'
import promptPackageName from '../helpers/promptPackageName'
import promptCodeLint from '../helpers/promptCodeLint'
import createReadme from '../helpers/createReadme'

const create = async (): Promise<void> => {
  // Check if package.json exists
  const packageJsonExists = await exists('package.json')
  if (packageJsonExists) {
    console.log('Projects with existing package.json not supported yet.')
    return
  }

  const readmeExistsPromise = exists('README.md')
  const eslintConfigExistsPromise = exists(eslintConfigFile)

  // Find git remote
  const cwd = process.cwd()
  let gitConfigPath: string | undefined
  try {
    gitConfigPath = `${findGitRoot(cwd)}/config`
  } catch (e) {}
  let gitRemoteUrl: string | undefined
  if (gitConfigPath !== undefined) {
    let config: Config | null
    try {
      config = await parseGitConfig({ path: gitConfigPath })
    } catch (e) {
      throw wrapError(e, 'Error reading git config')
    }
    gitRemoteUrl = config?.['remote "origin"'].url
  }
  if (gitRemoteUrl !== undefined) console.log(`Detected git remote: ${gitRemoteUrl}`)

  // Find license
  const licensePath = findConfig('LICENSE')
  const licenseContent = await nullishAnd(readFile, licensePath, 'utf8') as WithUndefined<string>
  const licenseName = nullishAnd(findLicense, licenseContent)
  nullishAnd((licenseName: string) => {
    console.log(`Detected license: ${licenseName}`)
  }, licenseName)

  // Find README.md
  const readmeExists = await readmeExistsPromise
  if (readmeExists) console.log('Detected README.md')
  const writeReadme = !readmeExists || await promptReplaceFile('README.md')

  const willBePublished = await promptBoolean('Will this package be published?', true)
  const name = await promptPackageName()
  const codeLint = await promptCodeLint()
  const eslintConfigExists = await eslintConfigExistsPromise
  if (codeLint === 'standard' && eslintConfigExists)console.log('Detected .eslintrc.json')
  const writeEslintConfig = !eslintConfigExists || await promptReplaceFile(eslintConfigFile)

  const isGithubRemote = gitRemoteUrl?.startsWith('https://github.com') === true
  if (isGithubRemote && codeLint === 'standard') {
    console.log('Detected GitHub remote.')
  }
  const createGithubLintWorkflow =
    isGithubRemote &&
    codeLint === 'standard' &&
    await promptGithubWorkflow()

  await Promise.all([
    createPackageJson(
      !willBePublished,
      name,
      licenseName,
      gitConfigPath,
      gitRemoteUrl,
      codeLint
    ),
    writeReadme && createReadme(name, codeLint),
    writeEslintConfig && createEslintConfig(codeLint),
    createGithubLintWorkflow && createLintWorkflow()
  ])
}

export default create
