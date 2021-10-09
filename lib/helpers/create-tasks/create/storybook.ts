import { Task } from '../../dependency-queue'
import promptDocs, { Docs } from '../prompts/promptDocs'
import packageJsonTask, { PackageJsonEditor } from './packageJson'
import resolvePackageVersions from '../../../resolvePackageVersions'
import { copyFile } from 'fs/promises'
import { join } from 'path'
import resPath from '../../resPath'
import ensureDir from '@appgeist/ensure-dir'

const storybookConfigDir = '.storybook'

const storybook: Task<void, [Docs, PackageJsonEditor]> = {
  dependencies: [promptDocs, packageJsonTask],
  fn: (docs, packageJson) => {
    if (docs !== Docs.STORYBOOK) return
    const { data } = packageJson
    Object.assign(data.scripts ?? (data.scripts = {}), {
      'build:docs': 'build-storybook -o docs',
      storybook: 'start-storybook'
    })
    packageJson.beforeWrite.push((async () => {
      const storybookPackages: Record<string, string> = {
        '@storybook/react': '^6.3.9',
        '@storybook/addon-essentials': '^6.3.9',
        'storybook-dark-mode': '^1.0.8'
      }
      Object.assign(data.devDependencies ?? (data.devDependencies = {}),
        await resolvePackageVersions(storybookPackages))
    })(), ensureDir(storybookConfigDir).then(async () =>
      await copyFile(join(resPath, 'storybookConfig.js'), join(storybookConfigDir, 'main.js'))))
  }
}

export default storybook
