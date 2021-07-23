import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import promptSelectMultiple from '../../promptSelectMultiple'
import { Test } from '../../tests'
import { Workflow } from '../../workflows'
import findGitRemote, { FindGitResult } from './findGitRemote'
import promptCodeLint from './promptCodeLint'
import promptTests from './promptTests'

const shouldWriteGithubWorkflow: Task<Promise<Set<Workflow>>, [FindGitResult, CodeLint, Test]> = {
  dependencies: [findGitRemote, promptCodeLint, promptTests],
  fn: async (git, codeLint, tests) => {
    const isGithubRemote = git?.remoteUrl?.startsWith('https://github.com') === true
    const possibleWorkflows: Record<Workflow, boolean> = {
      lint: codeLint === 'standard',
      test: tests === 'mocha'
    }
    const canCreateWorkflow = Object.values(possibleWorkflows).includes(true)
    if (!(isGithubRemote && canCreateWorkflow)) return new Set()
    console.log('Detected GitHub remote.')
    return new Set(
      await promptSelectMultiple<Workflow>('What GitHub workflow files would you like to create?',
        Object.entries(possibleWorkflows).map(([workflow, isPossible]) => ({
          value: workflow as Workflow,
          disabled: !isPossible,
          selected: isPossible
        }))))
  }
}

export default shouldWriteGithubWorkflow
