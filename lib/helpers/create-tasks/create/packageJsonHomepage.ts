import { Task } from '../../dependency-queue'
import nullishAnd from '../../nullishAnd'
import findGitRemote, { FindGitResult } from '../prompts/findGitRemote'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonHomepage: Task<void, [FindGitResult, PackageJsonEditor]> = {
  dependencies: [findGitRemote, packageJsonTask],
  fn: (git, packageJson) => {
    nullishAnd(gitRemoteUrl => {
      packageJson.data.homepage = `${gitRemoteUrl.slice(0, -4)}#readme`
    }, git?.remoteUrl)
  }
}

export default packageJsonHomepage
