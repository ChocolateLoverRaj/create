#!/usr/bin/env node
import handleAsync from './handleAsync'
import parseGitConfig, { Config } from 'parse-git-config'
import findGitRoot from 'find-git-root'
import { access } from 'fs/promises'
import wrapError from '@calipsa/wrap-error'
import { writeFile } from 'jsonfile'
import prompt from 'prompt'
import packageNameRegex from 'package-name-regex'

handleAsync(async () => {
  // Start prompt right away
  prompt.start()

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
  console.log('Creating package.json')
  const answer = await prompt.get([{ properties: { name: { name: 'Name of package', pattern: packageNameRegex } } }])
  await writeFile('package.json', {
    ...answer
  }, { spaces: 2 })
})
