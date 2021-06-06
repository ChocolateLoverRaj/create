import { AnyTask, OneByOne } from '../../dependency-queue'
import promptPackageNameTask from './promptPackageName'
import findGitRemote from './findGitRemote'
import findLicenseTask from './findLicense'
import packageJsonExists from './packageJsonExists'
import promptProjectType from './promptProjectType'
import shouldWriteReadme from './shouldWriteReadme'
import promptTargetModules from './promptTargetModules'
import promptSourceModule from './promptSourceModule'
import promptCodeLint from './promptCodeLint'
import shouldWriteEslintConfig from './shouldWriteEslintConfig'
import shouldWriteGithubWorkflow from './shouldWriteGithubWorkflow'
import promptTypeScript from './promptTypeScript'
import promptTests from './promptTests'

const createTasks: Array<AnyTask<any, OneByOne>> = [
  packageJsonExists,
  findGitRemote,
  findLicenseTask,
  shouldWriteReadme,
  promptProjectType,
  promptPackageNameTask,
  promptTargetModules,
  promptTypeScript,
  promptSourceModule,
  promptCodeLint,
  promptTests,
  shouldWriteEslintConfig,
  shouldWriteGithubWorkflow
]

export default createTasks
