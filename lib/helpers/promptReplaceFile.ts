import prompts from 'prompts'
import abortOnKill from './abortOnKill'

const promptReplaceFile = async (fileName: string): Promise<boolean> => (await prompts({
  name: 'main',
  message: `${fileName} already exists. Would you like to replace it?`,
  type: 'confirm',
  onState: abortOnKill
})).main

export default promptReplaceFile
