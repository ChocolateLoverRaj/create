import prompts, { PromptObject } from 'prompts'
import abortOnKill from './abortOnKill'

const promptString = async (
  message: string,
  validate?: PromptObject['validate']
): Promise<string> => (await prompts({
  message,
  name: 'main',
  type: 'text',
  validate,
  onState: abortOnKill
})).main

export default promptString
