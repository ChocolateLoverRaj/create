import never from 'never'
import getLatestPackage from './getLatestPackage'

const getLatestPackageVersion = async (packageName: string, range: string): Promise<string> =>
  (await getLatestPackage(packageName, range))?.version ?? never('No package version.')

export default getLatestPackageVersion
