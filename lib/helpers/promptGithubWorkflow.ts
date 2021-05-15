import prompt from 'prompt'

const promptGithubWorkflow = async (): Promise<boolean> => (await prompt.get([{
  properties: {
    createGithubWorkflow: {
      description: 'Would you like to create GitHub Actions workflow files to check code lint?',
      type: 'boolean',
      default: true
    }
  }
}])).createGithubWorkflow as boolean

export default promptGithubWorkflow
