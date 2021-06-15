import fn from '../a'
import mockAFn from '../mockA'

jest.mock('../a')
test('mockA works', () => {
  expect(fn).toBe(mockAFn)
})
