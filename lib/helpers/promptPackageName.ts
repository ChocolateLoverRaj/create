import packageNameRegex from 'package-name-regex'
import prompts from 'prompts'

const promptPackageName = async (): Promise<string> => (await prompts({
  message: 'Name of package',
  name: 'main',
  type: 'text',
  validate: name => packageNameRegex.test(name) || 'Invalid package name'
})).main

export default promptPackageName
