import getPackage from './getPackage'

const packageExists = async (packageName: string): Promise<boolean> =>
  await getPackage(packageName) !== null

export default packageExists
