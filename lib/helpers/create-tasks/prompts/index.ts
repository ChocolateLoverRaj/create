import { AnyTask, OneByOne } from '../../dependency-queue'
import promptPackageNameTask from './promptPackageName'
import findGitRemote from './findGitRemote'
import findLicenseTask from './findLicense'
import packageJsonExists from './packageJsonExists'
import promptWillBePublished from './promptWillBePublished'
import shouldWriteReadme from './shouldWriteReadme'
import promptTargetModules from './promptTargetModules'
import promptSourceModule from './promptSourceModule'
import promptCodeLint from './promptCodeLint'
import shouldWriteEslintConfig from './shouldWriteEslintConfig'
import shouldWriteGithubWorkflow from './shouldWriteGithubWorkflow'
import promptTypeScript from './promptTypeScript'

const createTasks: Array<AnyTask<any, OneByOne>> = [
  packageJsonExists,
  findGitRemote,
  findLicenseTask,
  shouldWriteReadme,
  promptWillBePublished,
  promptPackageNameTask,
  promptTargetModules,
  promptTypeScript,
  promptSourceModule,
  promptCodeLint,
  shouldWriteEslintConfig,
  shouldWriteGithubWorkflow
]

export default createTasks
