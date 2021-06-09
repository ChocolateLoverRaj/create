export const fn = jest.fn<string, []>()

export const realProcessCwd = process.cwd

export const mock = (): void => {
  process.cwd = fn
}

export const restore = (): void => {
  process.cwd = realProcessCwd
}
