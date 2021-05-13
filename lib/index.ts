#!/usr/bin/env node
import handleAsync from './handleAsync'
import parseGitConfig, { Config } from 'parse-git-config'
import findGitRoot from 'find-git-root'
import { access, readFile } from 'fs/promises'
import wrapError from '@calipsa/wrap-error'
import { writeFile } from 'jsonfile'
import prompt from 'prompt'
import packageNameRegex from 'package-name-regex'
import findConfig from 'find-config'
import findLicense from './findLicense'
import nullishAnd, { WithUndefined } from './nullishAnd'
import { dirname, relative } from 'path'
import normalize from 'normalize-path'

handleAsync(async () => {
  // Start prompt right away
  prompt.start()

  // Check if package.json exists
  let packageJsonExists: boolean
  try {
    await access('package.json')
    packageJsonExists = true
  } catch (e) {
    if (e.code === 'ENOENT') {
      packageJsonExists = false
    } else throw wrapError(e, 'Error checking if package.json exists')
  }
  if (packageJsonExists) {
    console.log('Projects with existing package.json not supported yet.')
    return
  }

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
  const { name } = await prompt.get([{
    properties: {
      name: {
        description: 'Name of package',
        pattern: packageNameRegex,
        required: true
      }
    }
  }])
  console.log('Creating package.json')
  await writeFile('package.json', {
    private: !(willBePublished as boolean) || undefined,
    name,
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
  }, { spaces: 2 })
})
