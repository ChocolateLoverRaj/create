import { Task } from '../../dependency-queue'
import getLatestPackage from '../../getLatestPackage'
import getMainFileName from '../../getMainFileName'
import libDirPath from '../../libDirPath'
import promptTypedoc from '../prompts/promptTypedoc'
import promptTypeScript from '../prompts/promptTypeScript'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import never from 'never'

const typedoc: Task<void, [boolean, PackageJsonEditor, boolean]> = {
  dependencies: [promptTypedoc, packageJsonTask, promptTypeScript],
  fn: (typedoc, packageJson, ts) => {
    if (!typedoc) return
    const { data } = packageJson
    Object.assign(data.scripts ?? (data.scripts = {}), {
      'build:docs': `typedoc ${libDirPath}/${getMainFileName(ts)}`
    })
    packageJson.beforeWrite.push((async () => {
      const latestTypedocVersion = (await getLatestPackage('typedoc', '^0.21.5'))?.version ??
      never('No typedoc version')
      Object.assign(data.devDependencies ?? (data.devDependencies = {}), {
        typedoc: `^${latestTypedocVersion}`
      })
    })())
  }
}

export default typedoc
