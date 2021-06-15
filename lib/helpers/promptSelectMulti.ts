import prompts, { Choice as PromptsChoice } from 'prompts'
import abortOnKill from './abortOnKill'

interface Choice<T extends string = string> {
  value: T
  description?: string
  disabled?: boolean
  selected?: boolean
}

const promptSelectMulti = async <T extends string = string>(
  message: string,
  choices: ReadonlyArray<T | Choice<T>>,
  min?: number
): Promise<T[]> => (await prompts({
  message,
  name: 'main',
  // cspell: disable-next-line
  type: 'multiselect',
  choices: choices.map<PromptsChoice>(option => typeof option === 'string'
    ? { title: option, value: option }
    : {
        title: option.value,
        value: option.value,
        description: option.description,
        disabled: option.disabled,
        selected: option.selected
      }),
  onState: abortOnKill,
  min
})).main

export default promptSelectMulti
