import { Task } from '../../dependency-queue'
import promptSelect from '../../promptSelect'
import tests, { Test } from '../../tests'
import promptReact from './promptReact'
import promptTypeScript from './promptTypeScript'

const promptTests: Task<Promise<Test>, [boolean, boolean]> = {
  dependencies: [promptTypeScript, promptReact],
  fn: async (ts, react) => await promptSelect(
    'What test tool should be used?',
    tests.map(test => ({
      value: test,
      // Mocha does not have snapshot testing
      disabled: react && test === 'mocha'
    })),
    tests.indexOf(ts ? 'jest' : 'mocha')
  )
}

export default promptTests
