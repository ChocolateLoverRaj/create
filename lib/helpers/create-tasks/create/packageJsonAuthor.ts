import { Octokit } from '@octokit/rest'
import { Task } from '../../dependency-queue'
import getGithubUsername from '../../getGithubUsername'
import getGithubUserUrl from '../../getGithubUserUrl'
import nullishAnd from '../../nullishAnd'
import findGitRemote, { FindGitResult } from '../prompts/findGitRemote'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonAuthor: Task<void, [FindGitResult, PackageJsonEditor]> = {
  dependencies: [findGitRemote, packageJsonTask],
  fn: (git, packageJson) => {
    packageJson.beforeWrite.push(nullishAnd(async remoteUrl => {
      const username = getGithubUsername(remoteUrl)
      const octokit = new Octokit()
      const { data: { name, email } } = await octokit.users.getByUsername({ username })
      packageJson.data.author = {
        name: name ?? username,
        email: email ?? undefined,
        url: getGithubUserUrl(username)
      }
    }, git?.remoteUrl))
  }
}

export default packageJsonAuthor
