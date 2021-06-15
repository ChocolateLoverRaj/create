import { readdirSync } from 'fs'
import { vol } from 'memfs'
import { mock, fn, restore } from '../../../test-helpers/mockProcessCwd'
import promptBoolean from '../../helpers/promptBoolean'
import promptString from '../../helpers/promptString'
import { answerQueue, myPromptBoolean } from '../../../test-helpers/mockPrompts'

jest.mock('fs')
jest.mock('../../helpers/promptBoolean')
jest.mock('../../helpers/promptString')
jest.mock('../../helpers/promptSelectMulti')
jest.mock('../../helpers/promptSelect')
test('mock prompts', async () => {
  answerQueue.push(true, 'Bob')
  expect(promptBoolean).toEqual(myPromptBoolean)
  console.log('was here')
  await expect(promptBoolean('Is someone there?')).resolves.toBe(true)
  await expect(promptString('What\'s your name?')).resolves.toBe('Bob')
})

test('mock fs', () => {
  vol.fromJSON({
    a: 'hi',
    b: 'hello'
  }, '/')
  expect(readdirSync('/')).toStrictEqual(['a', 'b'])
})

test('mock process.cwd', () => {
  const realCwd = process.cwd()
  mock()
  fn.mockReturnValue('test-fn')
  expect(process.cwd()).toBe('test-fn')
  restore()
  expect(process.cwd()).toBe(realCwd)
})
