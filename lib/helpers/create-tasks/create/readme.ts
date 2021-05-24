import { Task } from '../../dependency-queue'
import { writeFile, readFile } from 'fs/promises'
import pupa from 'pupa'
import resPath from '../../../helpers/resPath'
import { join } from 'path'
import { CodeLint } from '../../codeLints'
import promptPackageNameTask from '../prompts/promptPackageName'
import promptCodeLint from '../prompts/promptCodeLint'

const readmeTemplatePath = join(resPath, 'readmeTemplate.md')
const standardBadgePath = join(resPath, 'standardBadge.md')

const readme: Task<void, [string, CodeLint]> = {
  dependencies: [promptPackageNameTask, promptCodeLint],
  fn: async (name, codeLint) => {
    const codeLintBadge = codeLint === 'standard' ? await readFile(standardBadgePath, 'utf8') : ''
    await writeFile('README.md', pupa(
      await readFile(readmeTemplatePath, 'utf8'),
      { name, codeLintBadge }
    ))
  }
}

export default readme
