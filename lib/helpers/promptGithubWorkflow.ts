import prompts from 'prompts'
import abortOnKill from './abortOnKill'

const promptGithubWorkflow = async (): Promise<boolean> => (await prompts({
  name: 'main',
  message: 'Would you like to create GitHub Actions workflow files to check code lint?',
  type: 'toggle',
  initial: true,
  onState: abortOnKill
})).main

export default promptGithubWorkflow
