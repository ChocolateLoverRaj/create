import prompts from 'prompts'

const promptReplaceFile = async (fileName: string): Promise<boolean> => (await prompts({
  name: 'main',
  message: `${fileName} already exists. Would you like to replace it?`,
  type: 'confirm'
})).main

export default promptReplaceFile
