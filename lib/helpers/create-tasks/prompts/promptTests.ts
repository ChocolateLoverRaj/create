import { Task } from '../../dependency-queue'
import promptSelect from '../../promptSelect'
import tests, { Test } from '../../tests'

const promptTests: Task<Promise<Test>, []> = async () => await promptSelect(
  'What test tool should be used?',
  tests,
  1
)

export default promptTests
