import { Task } from '../../dependency-queue'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import findLicenseTask from '../prompts/findLicense'

const packageJsonLicense: Task<void, [string | undefined, PackageJsonEditor]> = {
  dependencies: [findLicenseTask, packageJsonTask],
  fn: (license, packageJson) => {
    packageJson.data.license = license
  }
}

export default packageJsonLicense
