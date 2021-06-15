import promptString from '../promptString'

const fn = jest.fn<ReturnType<typeof promptString>, Parameters<typeof promptString>>()

export default fn
