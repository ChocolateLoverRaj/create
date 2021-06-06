import { Task } from '../../dependency-queue'
import { ProjectType } from '../../projectTypes'
import promptProjectType from '../prompts/promptProjectType'
import packageJsonTask, { PackageJsonEditor } from './packageJson'

const packageJsonPrivate: Task<void, [PackageJsonEditor, ProjectType]> = {
  dependencies: [packageJsonTask, promptProjectType],
  fn: (packageJson, projectType) => {
    if (projectType !== 'package') packageJson.data.private = true
  }
}

export default packageJsonPrivate
