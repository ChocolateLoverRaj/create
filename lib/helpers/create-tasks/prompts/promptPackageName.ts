import { Task } from '../../dependency-queue'
import getPackage from '../../getPackage'
import { ProjectType } from '../../projectTypes'
import promptBoolean from '../../promptBoolean'
import promptPackageName from '../../promptPackageName'
import promptProjectType from './promptProjectType'

const promptPackageNameTask: Task<Promise<string>, [ProjectType]> = {
  dependencies: [promptProjectType],
  fn: async projectType => {
    let packageName = await promptPackageName()
    if (
      projectType === 'package' &&
      await getPackage(packageName) !== null &&
      await promptBoolean(`A package with the name '${packageName} already exists. \
Do you want to pick a different name?`, true)) {
      packageName = await promptPackageName(true)
    }
    return packageName
  }
}
export default promptPackageNameTask
