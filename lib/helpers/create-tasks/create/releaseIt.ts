import { Task } from '../../dependency-queue'
import { Workflow } from '../../workflows'
import shouldWriteGithubWorkflow from '../prompts/shouldWriteGithubWorkflow'
import { copyFile } from 'fs/promises'
import { join } from 'path'
import resDir from '../../resPath'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import resolvePackageVersions from '../../../resolvePackageVersions'

const releaseIt: Task<void, [Set<Workflow>, PackageJsonEditor]> = {
  dependencies: [shouldWriteGithubWorkflow, packageJsonTask],
  fn: async (workflows, { beforeWrite, data }) => {
    if (workflows.has('release')) {
      beforeWrite.push((async () => {
        Object.assign(data.devDependencies ?? (data.devDependencies = {}),
          await resolvePackageVersions({
            'release-it': '^14.9.0'
          }))
      })())
      await copyFile(join(resDir, 'releaseIt.json'), '.release-it.json')
    }
  }
}

export default releaseIt
