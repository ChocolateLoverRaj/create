import parseGitConfig, { Config } from 'parse-git-config'
import findGitRoot from 'find-git-root'
import { writeFile, readFile } from 'fs/promises'
import wrapError from '@calipsa/wrap-error'
import { writeFile as writeJsonFile } from 'jsonfile'
import prompt from 'prompt'
import packageNameRegex from 'package-name-regex'
import findConfig from 'find-config'
import findLicense from '../helpers/findLicense'
import nullishAnd, { WithUndefined } from '../helpers/nullishAnd'
import { dirname, relative, join } from 'path'
import normalize from 'normalize-path'
import exists from 'path-exists'
import promptReplaceReadme from '../helpers/promptReplaceReadme'
import pupa from 'pupa'

const resPath = join(__dirname, '../../res')
const readmeTemplatePath = join(resPath, 'readmeTemplate.md')

const create = async (): Promise<void> => {
  // Start prompt right away
  prompt.start()

  // Check if package.json exists
  const packageJsonExists = await exists('package.json')
  if (packageJsonExists) {
    console.log('Projects with existing package.json not supported yet.')
    return
  }

  const readmeExistsPromise = exists('README.md')

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

  const { willBePublished } = await prompt.get([{
    properties: {
      willBePublished: {
        description: 'Will this package be published?',
        type: 'boolean',
        default: true
      }
    }
  }])
  const name = (await prompt.get([{
    properties: {
      name: {
        description: 'Name of package',
        pattern: packageNameRegex,
        required: true
      }
    }
  }])).name as string

  const promises: Array<Promise<unknown>> = [writeJsonFile('package.json', {
    private: !(willBePublished as boolean) || undefined,
    name,
    version: '1.0.0',
    license: licenseName,
    ...nullishAnd(
      (gitRemoteUrl: string) => {
        const directory = normalize(relative(dirname(dirname(gitConfigPath as string)), cwd))
        return {
          homepage: `${gitRemoteUrl.slice(0, -4)}#readme`,
          repository: {
            type: 'git',
            url: `git+${gitRemoteUrl}`,
            directory: directory !== '' ? directory : undefined
          }
        }
      },
      gitRemoteUrl
    )
  }, { spaces: 2 })]

  if (!(await readmeExistsPromise) || await promptReplaceReadme()) {
    promises.push(writeFile('README.md', pupa(
      await readFile(readmeTemplatePath, 'utf8'),
      { name }
    )))
  }

  await Promise.all(promises)
}

export default create
