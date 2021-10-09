import resolvePackageVersions from '../../../resolvePackageVersions'
import { Task } from '../../dependency-queue'
import promptReact from '../prompts/promptReact'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const react: Task<void, [boolean, PackageJsonEditor]> = {
  dependencies: [promptReact, packageJsonTask],
  fn: (react, packageJson) => {
    if (react) {
      packageJson.beforeWrite.push((async () => {
        const deps = await resolvePackageVersions({
          react: '^17.0.2',
          'react-dom': '^17.0.2'
        })
        Object.assign(
          packageJson.data.peerDependencies ?? (packageJson.data.peerDependencies = {}), deps)
        Object.assign(
          packageJson.data.devDependencies ?? (packageJson.data.devDependencies = {}), deps)
      })())
    }
  }
}

export default react
