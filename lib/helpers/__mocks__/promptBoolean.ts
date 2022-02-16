import promptBoolean from '../promptBoolean'

const fn = jest.fn<ReturnType<typeof promptBoolean>, Parameters<typeof promptBoolean>>()

export default fn
