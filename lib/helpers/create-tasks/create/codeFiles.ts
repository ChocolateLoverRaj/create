import { Task } from '../../dependency-queue'
import { Module } from '../../modules'
import promptSourceModule from '../prompts/promptSourceModule'
import { join } from 'path'
import resPath from '../../resPath'
import { mkdir, copyFile } from 'fs/promises'
import promptWillBePublished from '../prompts/promptWillBePublished'
import libDirPath from '../../libDirPath'
import mainFilePath from '../../mainFilePath'

const libraryPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'library.cjs'),
  ESModules: join(resPath, 'library.mjs')
}
const privateProjectPath = join(resPath, 'private.js')

const codeFiles: Task<void, [boolean, Module]> = {
  dependencies: [promptWillBePublished, promptSourceModule],
  fn: async (isLibrary, sourceModule) => {
    await mkdir(libDirPath)
    await copyFile(isLibrary ? libraryPaths[sourceModule] : privateProjectPath, mainFilePath)
  }
}

export default codeFiles
