import { writeFile } from 'jsonfile'
import { FastestParallel, Task } from '../../dependency-queue'
import { afterAll } from '../../dependency-queue/symbols'
import { Package } from '../../getPackageFromVersion'

export interface PackageJsonEditor {
  data: Package
  beforeWrite: unknown[]
  finishPromise: Promise<void>
}

const packageJsonTask: Task<PackageJsonEditor, [typeof afterAll], FastestParallel> = {
  dependencies: [afterAll],
  fn: afterAll => {
    const packageJsonEditor: PackageJsonEditor = {
      beforeWrite: [],
      data: {}
    } as unknown as PackageJsonEditor
    packageJsonEditor.finishPromise = (async () => {
      // Let other tasks mutate packageJsonEditor first
      await afterAll
      await Promise.all(packageJsonEditor.beforeWrite)
      await writeFile('package.json', packageJsonEditor.data, { spaces: 2 })
    })()
    return packageJsonEditor
  }
}

export default packageJsonTask
