import axios from 'axios'
import { Package } from './getPackageFromVersion'
import wrapError from '@calipsa/wrap-error'

export interface PackageVersions {
  versions: {
    [version: string]: Package
  }
}

/**
 * Get all versions of a package
 */
const getPackage = async (packageName: string): Promise<PackageVersions | null> => {
  try {
    return (await axios({
      url: `https://registry.npmjs.org/${packageName}`
    })).data
  } catch (e) {
    if (e.response.status === 404) return null
    throw wrapError(e, 'Npm registry responded with unknown status code.')
  }
}

export default getPackage
