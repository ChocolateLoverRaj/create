import isNullish from '../isNullish'

test('undefined', () => {
  expect(isNullish(undefined)).toBe(true)
})

test('null', () => {
  expect(isNullish(null)).toBe(true)
})
