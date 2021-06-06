import prompts, { Choice } from 'prompts'
import abortOnKill from './abortOnKill'

export interface Option<T extends string = string> {
  value: T
  description?: string
}

const promptSelect = async <T extends string = string>(
  message: string,
  options: ReadonlyArray<T | Option<T>>,
  initial?: number
): Promise<T> => (await prompts({
  message,
  name: 'main',
  type: 'select',
  choices: options.map<Choice>(option => typeof option === 'string'
    ? {
        title: option,
        value: option
      }
    : {
        title: option.value,
        value: option.value,
        description: option.description
      }),
  initial,
  onState: abortOnKill
})).main

export default promptSelect
