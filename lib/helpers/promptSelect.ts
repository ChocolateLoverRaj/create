import prompts, { Choice as PromptsChoice } from 'prompts'
import abortOnKill from './abortOnKill'

interface Choice<T extends string = string> {
  value: T
  description?: string
  disabled?: boolean
}

const promptSelect = async <T extends string = string>(
  message: string,
  choices: ReadonlyArray<T | Choice<T>>,
  initial?: number
): Promise<T> => (await prompts({
  message,
  name: 'main',
  type: 'select',
  choices: choices.map<PromptsChoice>(option => typeof option === 'string'
    ? { title: option, value: option }
    : {
        title: option.value,
        value: option.value,
        description: option.description,
        disabled: option.disabled
      }),
  initial,
  onState: abortOnKill
})).main

export default promptSelect
