import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import promptCodeLint from '../prompts/promptCodeLint'
import { join } from 'path'
import resPath from '../../resPath'
import { copyFile } from 'fs/promises'
import ensureDir from '@appgeist/ensure-dir'
import shouldWriteGithubWorkflow from '../prompts/shouldWriteGithubWorkflow'

const lintWorkflowPath = join(resPath, 'lintWorkflow.yml')
const workflowsDir = '.github/workflows'

const lintWorkflow: Task<void, [CodeLint, boolean]> = {
  dependencies: [promptCodeLint, shouldWriteGithubWorkflow],
  fn: async (codeLint, writeWorkflow) => {
    if (codeLint === 'standard' && writeWorkflow) {
      await ensureDir(workflowsDir)
      await copyFile(lintWorkflowPath, join(workflowsDir, 'lint.yml'))
    }
  }
}

export default lintWorkflow
