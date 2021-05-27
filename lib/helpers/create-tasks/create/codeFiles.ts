import { Task } from '../../dependency-queue'
import { Module } from '../../modules'
import promptSourceModule from '../prompts/promptSourceModule'
import { join } from 'path'
import resPath from '../../resPath'
import { mkdir, copyFile } from 'fs/promises'
import promptWillBePublished from '../prompts/promptWillBePublished'
import libDirPath from '../../libDirPath'
import promptTypeScript from '../prompts/promptTypeScript'
import getMainFileName from '../../getMainFileName'

const jsLibraryPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'library.cjs'),
  ESModules: join(resPath, 'library.mjs')
}
const privateProjectPath = join(resPath, 'private.js')
const tsLibraryPath = join(resPath, 'library.ts')

const codeFiles: Task<void, [boolean, Module, boolean]> = {
  dependencies: [promptWillBePublished, promptSourceModule, promptTypeScript],
  fn: async (isLibrary, sourceModule, ts) => {
    await mkdir(libDirPath)
    await copyFile(isLibrary
      ? ts ? tsLibraryPath : jsLibraryPaths[sourceModule]
      : privateProjectPath,
    join(libDirPath, getMainFileName(ts))
    )
  }
}

export default codeFiles
