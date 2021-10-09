import prompts from 'prompts'
import abortOnKill from './abortOnKill'

export interface Option<T extends string> {
  value: T
  disabled?: boolean
}

const promptSelect = async <T extends string = string>(
  message: string,
  options: ReadonlyArray<T | Option<T>>,
  initial?: number
): Promise<T> => (await prompts({
  message,
  name: 'main',
  type: 'select',
  choices: options.map(option => typeof option === 'string'
    ? { title: option, value: option }
    : { title: option.value, ...option }),
  initial,
  onState: abortOnKill
})).main

export default promptSelect
