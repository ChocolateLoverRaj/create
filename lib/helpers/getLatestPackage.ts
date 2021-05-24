import maxSatisfying from 'semver/ranges/max-satisfying'
import { Package } from './getPackageFromVersion'
import getPackage from './getPackage'
import never from 'never'

/**
 * Get the latest package that matches a semver range
 */
const getLatestPackage = async (packageName: string, range: string): Promise<Package | null> => {
  const packageVersions = await getPackage(packageName) ?? never('Package doesn\'t exist')
  const versions = Object.keys(packageVersions.versions)
  const latestVersion = maxSatisfying(versions, range) ?? never('No satisfying versions')
  return packageVersions.versions[latestVersion]
}

export default getLatestPackage
