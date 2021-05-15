import prompt from 'prompt'

const promptReplaceFile = async (fileName: string): Promise<boolean> => ((await prompt.get([{
  properties: {
    cancel: {
      description: `${fileName} already exists. Would you like to replace it?`,
      type: 'boolean',
      default: false
    }
  }
}])).cancel) as boolean

export default promptReplaceFile
