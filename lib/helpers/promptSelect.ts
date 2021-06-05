import prompts from 'prompts'
import abortOnKill from './abortOnKill'

const promptSelect = async <T extends string = string>(
  message: string,
  options: readonly T[],
  initial?: number
): Promise<T> => (await prompts({
  message,
  name: 'main',
  type: 'select',
  choices: options.map(option => ({ title: option, value: option })),
  initial,
  onState: abortOnKill
})).main

export default promptSelect
