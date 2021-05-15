import { join } from 'path'
import resPath from './resPath'
import { copyFile } from 'fs/promises'
import ensureDir from '@appgeist/ensure-dir'

const lintWorkflowPath = join(resPath, 'lintWorkflow.yml')
const workflowsDir = '.github/workflows'

const createLintWorkflow = async (): Promise<void> => {
  await ensureDir(workflowsDir)
  await copyFile(lintWorkflowPath, join(workflowsDir, 'lint.yml'))
}

export default createLintWorkflow
