import { Task } from '../../dependency-queue'
import { writeFile, readFile } from 'fs/promises'
import pupa from 'pupa'
import resPath from '../../../helpers/resPath'
import { join } from 'path'
import { CodeLint } from '../../codeLints'
import promptPackageNameTask from '../prompts/promptPackageName'
import promptCodeLint from '../prompts/promptCodeLint'
import promptTypeScript from '../prompts/promptTypeScript'

const readmeTemplatePath = join(resPath, 'readmeTemplate.md')
const standardBadgePath = join(resPath, 'standardBadge.md')
const tsStandardBadgePath = join(resPath, 'tsStandardBadge.md')

const readme: Task<void, [string, CodeLint, boolean]> = {
  dependencies: [promptPackageNameTask, promptCodeLint, promptTypeScript],
  fn: async (name, codeLint, ts) => {
    const badgePath = ts ? tsStandardBadgePath : standardBadgePath
    const codeLintBadge = codeLint === 'standard' ? await readFile(badgePath, 'utf8') : ''
    await writeFile('README.md', pupa(
      await readFile(readmeTemplatePath, 'utf8'),
      { name, codeLintBadge }
    ))
  }
}

export default readme
