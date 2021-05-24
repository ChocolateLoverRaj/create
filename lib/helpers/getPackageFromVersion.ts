import axios from 'axios'

export interface Dependencies {
  [name: string]: string
}

export interface Package {
  name?: string
  version?: string
  peerDependencies?: Dependencies
  private?: boolean
  author?: {
    name: string
    email?: string
    url?: string
  }
  homepage?: string
  license?: string
  repository?: {
    directory?: string
    type?: string
    url?: string
  }
  devDependencies?: Dependencies
  scripts?: Record<string, string>
  main?: string
  type?: 'commonjs' | 'module'
  exports?: object
}

/**
 * Get an npm package from the npm registry for a specific function.
 */
const getPackageFromVersion = async (
  packageName: string,
  version = 'latest'
): Promise<Package> => (await axios({
  url: `https://registry.npmjs.org/${packageName}/${version}`
})).data

export default getPackageFromVersion
