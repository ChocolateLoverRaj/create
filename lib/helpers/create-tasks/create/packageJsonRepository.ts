import { Task } from '../../dependency-queue'
import nullishAnd from '../../nullishAnd'
import findGitRemote, { FindGitResult } from '../prompts/findGitRemote'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import { dirname, relative } from 'path'
import normalizePath from 'normalize-path'

const packageJsonRepository: Task<void, [FindGitResult, PackageJsonEditor]> = {
  dependencies: [findGitRemote, packageJsonTask],
  fn: (git, packageJson) => {
    nullishAnd((configPath, gitRemoteUrl) => {
      const repoRootDir = dirname(dirname(configPath))
      const directory = normalizePath(relative(repoRootDir, process.cwd()))
      packageJson.data.repository = {
        type: 'git',
        url: `git+${gitRemoteUrl}`,
        directory: directory !== '' ? directory : undefined
      }
    }, git?.configPath, git?.remoteUrl)
  }
}

export default packageJsonRepository
