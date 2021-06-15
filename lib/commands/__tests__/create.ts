import promptString from '../../helpers/__mocks__/promptString'
import promptBoolean from '../../helpers/__mocks__/promptBoolean'
import create from '../create'
import { fn, mock } from '../../../test-helpers/mockProcessCwd'

jest.mock('fs')
jest.mock('fs/promises')
jest.mock('../../helpers/promptBoolean')
jest.mock('../../helpers/promptString')
jest.mock('../../helpers/promptSelectMulti')
jest.mock('../../helpers/promptSelect')

describe('detects MIT License', () => {
  test('prints text', async () => {
    mock()
    fn.mockReturnValue('/')
    promptBoolean.mockImplementation(message => {
      console.log(message)
      return undefined as any
    })
    promptString.mockImplementation(message => {
      console.log(message)
      return undefined as any
    })
    await create()
  })
})
