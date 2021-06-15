import realFn from '../a'

const fn = jest.fn<ReturnType<typeof realFn>, Parameters<typeof realFn>>()

export default fn
