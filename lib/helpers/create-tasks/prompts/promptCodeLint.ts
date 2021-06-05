import codeLints, { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'
import promptSelect from '../../promptSelect'

const promptCodeLint: Task<Promise<CodeLint>, []> = async () => await promptSelect(
  'What style code lint should be used?',
  codeLints,
  1
)

export default promptCodeLint
