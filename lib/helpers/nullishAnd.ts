export type Nullable<T> = T | undefined | null

export type WithUndefined<T> = T | undefined

export type NullableArray<T extends unknown[]> = {
  [K in keyof T]: T[K] | Nullable<T[K]>
}

const nullishAnd = <R, T extends unknown[]>(
  fn: (...args: T) => R,
  ...args: NullableArray<T>
): R | undefined => {
  const isNullishSymbol = Symbol('is nullish')
  if (!args.map(v => v ?? isNullishSymbol).includes(isNullishSymbol)) return fn(...args as T)
}

export default nullishAnd
