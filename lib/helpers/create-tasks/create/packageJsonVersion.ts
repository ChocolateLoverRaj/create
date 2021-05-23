import { Task } from '../../dependency-queue'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonVersion: Task<void, [PackageJsonEditor]> = {
  dependencies: [packageJsonTask],
  fn: packageJson => {
    packageJson.data.version = '1.0.0'
  }
}

export default packageJsonVersion
