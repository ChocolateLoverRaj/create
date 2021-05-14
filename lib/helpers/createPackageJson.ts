import { writeFile } from 'jsonfile'
import normalizePath from 'normalize-path'
import nullishAnd from './nullishAnd'
import { relative, dirname } from 'path'
import { Octokit } from '@octokit/rest'
import getGithubUsername from './getGithubUsername'
import getGithubUserUrl from './getGithubUserUrl'

const createPackageJson = async (
  isPrivate: boolean,
  name: string,
  licenseName: string | undefined,
  gitConfigPath: string | undefined,
  gitRemoteUrl: string | undefined
): Promise<any> => {
  return await writeFile('package.json', {
    private: isPrivate ? true : undefined,
    name,
    version: '1.0.0',
    license: licenseName,
    ...await nullishAnd(
      async (gitRemoteUrl: string) => {
        const username = getGithubUsername(gitRemoteUrl)
        const octokit = new Octokit()
        const { data } = await octokit.users.getByUsername({ username })

        const repoRootDir = dirname(dirname(gitConfigPath as string))
        const directory = normalizePath(relative(repoRootDir, process.cwd()))
        return {
          author: {
            name: data.name ?? username,
            email: data.email ?? undefined,
            url: getGithubUserUrl(username)
          },
          homepage: `${gitRemoteUrl.slice(0, -4)}#readme`,
          repository: {
            type: 'git',
            url: `git+${gitRemoteUrl}`,
            directory: directory !== '' ? directory : undefined
          }
        }
      },
      gitRemoteUrl
    )
  }, { spaces: 2 })
}

export default createPackageJson
