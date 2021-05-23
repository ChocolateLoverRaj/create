import standard from './standard'
import lintScript from './lintScript'
import packageJsonTask from './packageJson'
import packageJsonAuthor from './packageJsonAuthor'
import packageJsonHomepage from './packageJsonHomepage'
import packageJsonLicense from './packageJsonLicense'
import packageJsonName from './packageJsonName'
import packageJsonPrivate from './packageJsonPrivate'
import packageJsonRepository from './packageJsonRepository'
import packageJsonVersion from './packageJsonVersion'
import lintWorkflow from './lintWorkflow'
import transpileModules from './transpileModules'
import codeFiles from './codeFiles'
import readme from './readme'

const createTasks = [
  packageJsonTask,
  packageJsonPrivate,
  packageJsonName,
  packageJsonVersion,
  packageJsonAuthor,
  packageJsonHomepage,
  packageJsonLicense,
  packageJsonRepository,
  standard,
  lintScript,
  lintWorkflow,
  transpileModules,
  codeFiles,
  readme
]

export default createTasks
