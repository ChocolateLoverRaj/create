import packageNameRegex from 'package-name-regex'
import prompts from 'prompts'
import abortOnKill from '../../abortOnKill'
import { Task } from '../../dependency-queue'

const promptPackageName: Task<Promise<string>, []> = async () => (await prompts({
  message: 'Name of package',
  name: 'main',
  type: 'text',
  validate: name => packageNameRegex.test(name) || 'Invalid package name',
  onState: abortOnKill
})).main

export default promptPackageName
