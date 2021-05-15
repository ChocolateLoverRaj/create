import prompts from 'prompts'

const promptGithubWorkflow = async (): Promise<boolean> => (await prompts({
  name: 'main',
  message: 'Would you like to create GitHub Actions workflow files to check code lint?',
  type: 'toggle',
  initial: true
})).main

export default promptGithubWorkflow
