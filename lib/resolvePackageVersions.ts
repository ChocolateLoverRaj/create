import getLatestPackage from './helpers/getLatestPackage'
import getLatestPackageVersion from './helpers/getLatestPackageVersion'
import never from 'never'

/**
 * Get a dependencies object with latest package versions
 */
const resolvePackageVersions = async (
  packages: Record<string, string>,
  alsoPeerDeps = false
): Promise<Record<string, string>> => {
  if (alsoPeerDeps) {
    const packageJsons = await Promise.all(Object.entries(packages).map(
      async ([name, version]) => await getLatestPackage(name, version) ?? never()))
    return Object.assign(
      Object.fromEntries(packageJsons.map(({ name, version }) => [name, version])),
      ...packageJsons.map(({ peerDependencies }) => peerDependencies))
  }
  return Object.fromEntries(
    await Promise.all(Object.entries(packages).map(async ([name, version]) => [
      name,
    `^${(await getLatestPackageVersion(name, version))}`
    ])))
}

export default resolvePackageVersions
