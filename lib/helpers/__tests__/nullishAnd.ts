import nullishAnd from '../nullishAnd'

test('works', () => {
  const fn = jest.fn()
  expect(nullishAnd(fn, undefined)).toBe(undefined)
  expect(fn).toBeCalledTimes(0)
})
