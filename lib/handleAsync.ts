export type AsyncFunction = () => Promise<unknown>

const handleAsync = (asyncFunction: AsyncFunction): void => {
  asyncFunction().catch(e => {
    console.error(e)
    process.exit(0)
  })
}

export default handleAsync
