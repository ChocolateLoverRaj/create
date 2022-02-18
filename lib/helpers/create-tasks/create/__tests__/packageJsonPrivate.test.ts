import packageJsonPrivate from '../packageJsonPrivate'

test('will not be published', () => {
  const data = {}
  packageJsonPrivate.fn({ data } as any, false)
  expect(data).toStrictEqual({ private: true })
})

test('will be published', () => {
  const data = {}
  packageJsonPrivate.fn({ data } as any, true)
  expect(data).toStrictEqual({ })
})
