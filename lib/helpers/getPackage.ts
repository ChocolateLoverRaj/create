import axios from 'axios'
import { Package } from './getPackageFromVersion'

export interface PackageVersions {
  versions: {
    [version: string]: Package
  }
}

/**
 * Get all versions of a package
 */
const getPackage = async (packageName: string): Promise<PackageVersions> => (await axios({
  url: `https://registry.npmjs.org/${packageName}`
})).data

export default getPackage
