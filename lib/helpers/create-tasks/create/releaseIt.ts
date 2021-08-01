import { Task } from '../../dependency-queue'
import { Workflow } from '../../workflows'
import shouldWriteGithubWorkflow from '../prompts/shouldWriteGithubWorkflow'
import { copyFile } from 'fs/promises'
import { join } from 'path'
import resDir from '../../resPath'

const releaseIt: Task<void, [Set<Workflow>]> = {
  dependencies: [shouldWriteGithubWorkflow],
  fn: async workflows => {
    if (workflows.has('release')) await copyFile(join(resDir, 'releaseIt.json'), '.release-it.json')
  }
}

export default releaseIt
