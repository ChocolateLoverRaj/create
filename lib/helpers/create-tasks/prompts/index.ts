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
import promptTests from './promptTests'
import promptDocs from './promptDocs'
import promptReact from './promptReact'

const createTasks: Array<AnyTask<any, OneByOne>> = [
  packageJsonExists,
  findGitRemote,
  findLicenseTask,
  shouldWriteReadme,
  promptWillBePublished,
  promptPackageNameTask,
  promptTargetModules,
  promptTypeScript,
  promptReact,
  promptSourceModule,
  promptCodeLint,
  promptTests,
  promptDocs,
  shouldWriteEslintConfig,
  shouldWriteGithubWorkflow
]

export default createTasks
