import { Task } from '../../dependency-queue'
import promptPackageNameTask from '../prompts/promptPackageName'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonName: Task<void, [string, PackageJsonEditor]> = {
  dependencies: [promptPackageNameTask, packageJsonTask],
  fn: async (name, packageJson) => {
    packageJson.data.name = name
    await packageJson.finishPromise
  }
}

export default packageJsonName
