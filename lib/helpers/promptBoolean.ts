import prompts from 'prompts'
import abortOnKill from './abortOnKill'

const promptBoolean = async (message: string, defaultAnswer?: boolean): Promise<boolean> =>
  (await prompts({
    name: 'main',
    type: 'toggle',
    initial: defaultAnswer,
    message,
    onState: abortOnKill
  })).main

export default promptBoolean
