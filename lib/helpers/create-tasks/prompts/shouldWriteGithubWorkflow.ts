import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import promptGithubWorkflow from '../../promptGithubWorkflow'
import findGitRemote, { FindGitResult } from './findGitRemote'
import promptCodeLint from './promptCodeLint'

const shouldWriteGithubWorkflow: Task<Promise<boolean>, [FindGitResult, CodeLint]> = {
  dependencies: [findGitRemote, promptCodeLint],
  fn: async (git, codeLint) => {
    const isGithubRemote = git?.remoteUrl?.startsWith('https://github.com') === true
    if (isGithubRemote && codeLint === 'standard')console.log('Detected GitHub remote.')
    return isGithubRemote && codeLint === 'standard' && await promptGithubWorkflow()
  }
}

export default shouldWriteGithubWorkflow
