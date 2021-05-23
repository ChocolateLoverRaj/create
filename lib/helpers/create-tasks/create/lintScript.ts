import { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import promptCodeLint from '../prompts/promptCodeLint'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const lintScript: Task<void, [CodeLint, PackageJsonEditor]> = {
  dependencies: [promptCodeLint, packageJsonTask],
  fn: (codeLint, { data }) => {
    if (codeLint === 'standard') {
      Object.assign(data.scripts ?? (data.scripts = {}), {
        lint: 'eslint .'
      })
    }
  }
}

export default lintScript
