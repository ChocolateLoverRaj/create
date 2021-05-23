import { Task } from '../../dependency-queue'
import promptWillBePublished from '../prompts/promptWillBePublished'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonPrivate: Task<void, [PackageJsonEditor, boolean]> = {
  dependencies: [packageJsonTask, promptWillBePublished],
  fn: (packageJson, willBePublished) => {
    if (!willBePublished) packageJson.data.private = true
  }
}

export default packageJsonPrivate
