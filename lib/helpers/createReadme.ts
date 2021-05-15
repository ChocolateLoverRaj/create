import { writeFile, readFile } from 'fs/promises'
import pupa from 'pupa'
import resPath from '../helpers/resPath'
import { join } from 'path'
import { CodeLint } from './codeLints'

const readmeTemplatePath = join(resPath, 'readmeTemplate.md')
const standardBadgePath = join(resPath, 'standardBadge.md')

const createReadme = async (name: string, codeLint: CodeLint): Promise<void> => {
  const codeLintBadge = codeLint === 'standard' ? await readFile(standardBadgePath, 'utf8') : ''
  await writeFile('README.md', pupa(
    await readFile(readmeTemplatePath, 'utf8'),
    { name, codeLintBadge }
  ))
}

export default createReadme
