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
import ghWorkflows from './ghWorkflows'
import transpileModules from './transpileModules'
import codeFiles from './codeFiles'
import readme from './readme'
import packageJsonExports from './packageJsonExports'
import ts from './ts'
import testsTask from './tests'
import typedoc from './typedoc'
import releaseIt from './releaseIt'
import storybook from './storybook'
import react from './react'

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
  ghWorkflows,
  transpileModules,
  codeFiles,
  readme,
  packageJsonExports,
  ts,
  testsTask,
  typedoc,
  storybook,
  releaseIt,
  react
]

export default createTasks
