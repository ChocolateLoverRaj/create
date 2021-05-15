import prompts from 'prompts'

const promptBoolean = async (message: string, defaultAnswer?: boolean): Promise<boolean> =>
  (await prompts({
    name: 'main',
    type: 'toggle',
    initial: defaultAnswer,
    message
  })).main

export default promptBoolean
