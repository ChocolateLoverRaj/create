import { Task } from '../../dependency-queue'
import getPackage from '../../getPackage'
import promptBoolean from '../../promptBoolean'
import promptPackageName from '../../promptPackageName'
import promptWillBePublished from './promptWillBePublished'

const promptPackageNameTask: Task<Promise<string>, [boolean]> = {
  dependencies: [promptWillBePublished],
  fn: async willBePublished => {
    let packageName = await promptPackageName()
    if (
      willBePublished &&
      await getPackage(packageName) !== null &&
      await promptBoolean(`A package with the name '${packageName} already exists. \
Do you want to pick a different name?`, true)) {
      packageName = await promptPackageName(true)
    }
    return packageName
  }
}
export default promptPackageNameTask
