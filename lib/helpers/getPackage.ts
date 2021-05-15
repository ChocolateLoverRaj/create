import axios from 'axios'

export interface Dependencies {
  [name: string]: string
}

export interface Package {
  version: string
  peerDependencies: Dependencies
}

/**
 * Get an npm package from the npm registry
 */
const getPackage = async (
  packageName: string,
  version = 'latest'
): Promise<Package> => (await axios({
  url: `https://registry.npmjs.org/${packageName}/${version}`
})).data

export default getPackage
