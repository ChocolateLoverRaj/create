import { Task } from '../../dependency-queue'
import promptSelect from '../../promptSelect'
import tests, { Test } from '../../tests'
import promptTypeScript from './promptTypeScript'

const promptTests: Task<Promise<Test>, [boolean]> = {
  dependencies: [promptTypeScript],
  fn: async ts => await promptSelect(
    'What test tool should be used?',
    tests,
    tests.indexOf(ts ? 'jest' : 'mocha')
  )
}

export default promptTests
