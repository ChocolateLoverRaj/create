import prompt from 'prompt'

const promptReplaceReadme = async (): Promise<boolean> => ((await prompt.get([{
  properties: {
    cancel: {
      description: 'README.md already exists. Would you like to replace it?',
      type: 'boolean',
      default: false
    }
  }
}])).cancel) as boolean

export default promptReplaceReadme
