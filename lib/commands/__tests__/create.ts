import promptString from '../../helpers/__mocks__/promptString'
import promptBoolean from '../../helpers/__mocks__/promptBoolean'
import create from '../create'
import { fn, mock } from '../../../test-helpers/mockProcessCwd'

describe('detects MIT License', () => {
  test.skip('prints text', async () => {
    mock()
    fn.mockReturnValue('/home/test')
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
