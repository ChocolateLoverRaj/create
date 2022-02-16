import never from 'never'
import promptBoolean from '../lib/helpers/__mocks__/promptBoolean'
import promptString from '../lib/helpers/__mocks__/promptString'
import promptSelect from '../lib/helpers/__mocks__/promptSelect'
import promptSelectMulti from '../lib/helpers/__mocks__/promptSelectMulti'

export const answerQueue: any[] = []

export const myPromptBoolean = promptBoolean

const mockFn = async (): Promise<any> => {
  console.log(answerQueue)
  return answerQueue.shift() ?? never('No answer in answer queue')
}

promptBoolean.mockImplementation(mockFn)
promptString.mockImplementation(mockFn)
promptSelect.mockImplementation(mockFn)
promptSelectMulti.mockImplementation(mockFn)
console.log('Mocked implementations')
