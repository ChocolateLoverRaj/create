import packageNameRegex from 'package-name-regex'
import prompts from 'prompts'
import abortOnKill from './abortOnKill'
import packageExists from './packageExists'

const promptPackageName = async (rejectTakenNames = false): Promise<string> => (await prompts({
  message: 'Name of package',
  name: 'main',
  type: 'text',
  validate: async name => packageNameRegex.test(name)
    ? !rejectTakenNames || (!await packageExists(name) || 'Package name taken')
    : 'Invalid package name',
  onState: abortOnKill
})).main

export default promptPackageName
