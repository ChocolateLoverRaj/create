import realPrompt from 'prompts'
import prompt from '../__mocks__/prompts'
import { readdirSync } from 'fs'
import { vol } from 'memfs'
import { mock, fn, restore } from '../../../test-helpers/mockProcessCwd'

jest.mock('fs')
test('mock prompts', async () => {
  expect(realPrompt).toBe(prompt)
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
