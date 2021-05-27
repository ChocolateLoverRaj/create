const isNullishSymbol = Symbol('is nullish')
const isNullish = (value: unknown): boolean => (value ?? isNullishSymbol) === isNullishSymbol

export default isNullish
