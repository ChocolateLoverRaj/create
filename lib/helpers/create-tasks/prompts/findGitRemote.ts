import findGitRoot from 'find-git-root'
import { Task } from '../../dependency-queue'
import parseGitConfig, { Config } from 'parse-git-config'
import wrapError from '@calipsa/wrap-error'

interface Git {
  remoteUrl?: string
  configPath: string
}

export type FindGitResult = Git | undefined

const findGitRemote: Task<Promise<FindGitResult>, []> = async () => {
  const cwd = process.cwd()
  let gitConfigPath: string | undefined
  try {
    gitConfigPath = `${findGitRoot(cwd)}/config`
  } catch (e) {}
  if (gitConfigPath !== undefined) {
    let config: Config | null
    try {
      config = await parseGitConfig({ path: gitConfigPath })
    } catch (e) {
      throw wrapError(e, 'Error reading git config')
    }
    const gitRemoteUrl: string | undefined = config?.['remote "origin"'].url
    if (gitRemoteUrl !== undefined) console.log(`Detected git remote: ${gitRemoteUrl}`)
    return {
      configPath: gitConfigPath,
      remoteUrl: gitRemoteUrl
    }
  }
}

export default findGitRemote
