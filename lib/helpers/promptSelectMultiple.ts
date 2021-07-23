import prompts from 'prompts'
import abortOnKill from './abortOnKill'

export interface Option<T extends string = string> {
  value: T
  selected?: boolean
  disabled?: boolean
}

const promptSelectMultiple = async <T extends string = string>(
  message: string,
  options: ReadonlyArray<T | Option<T>>,
  initial?: number
): Promise<T[]> => (await prompts({
  message,
  name: 'main',
  // cspell:disable-next-line
  type: 'multiselect',
  choices: options.map(option => {
    let value: T
    let selected: boolean | undefined
    let disabled: boolean | undefined
    if (typeof option === 'string') value = option
    else {
      value = option.value
      selected = option.selected
      disabled = option.disabled
    }
    return { title: value, value, selected, disabled }
  }),
  initial,
  onState: abortOnKill
})).main

export default promptSelectMultiple
