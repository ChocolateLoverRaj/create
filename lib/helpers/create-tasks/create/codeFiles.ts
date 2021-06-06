import { Task } from '../../dependency-queue'
import { Module } from '../../modules'
import promptSourceModule from '../prompts/promptSourceModule'
import { join } from 'path'
import resPath from '../../resPath'
import { mkdir, copyFile, readFile, writeFile } from 'fs/promises'
import promptProjectType from '../prompts/promptProjectType'
import libDirPath from '../../libDirPath'
import promptTypeScript from '../prompts/promptTypeScript'
import getMainFileName from '../../getMainFileName'
import { Test } from '../../tests'
import promptTests from '../prompts/promptTests'
import mainFileBaseName from '../../mainFileBaseName'
import testDir from './testDir'
import pupa from 'pupa'
import { ProjectType } from '../../projectTypes'

const jsLibraryPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'library.cjs'),
  ESModules: join(resPath, 'library.mjs')
}
const jsTestPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'test.cjs'),
  ESModules: join(resPath, 'test.mjs')
}
const privateProjectPath = join(resPath, 'private.js')
const tsLibraryPath = join(resPath, 'library.ts')
const tsTestPath = join(resPath, 'testTs.txt')
const jsGhActionPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'ghAction.cjs'),
  ESModules: join(resPath, 'ghAction.mjs')
}

const codeFiles: Task<void, [ProjectType, Module, boolean, Test]> = {
  dependencies: [promptProjectType, promptSourceModule, promptTypeScript, promptTests],
  fn: async (projectType, sourceModule, ts, test) => {
    await mkdir(libDirPath)
    await Promise.all<unknown>([
      copyFile(
        projectType === 'package'
          ? ts ? tsLibraryPath : jsLibraryPaths[sourceModule]
          : privateProjectPath,
        join(libDirPath, getMainFileName(ts))
      ),
      test === 'mocha' && (ts
        ? (async () => {
            await mkdir(testDir)
            const tsTestTemplate = await readFile(tsTestPath, 'utf8')
            const tsTestStr = pupa(tsTestTemplate, { libDirPath })
            await writeFile(join(testDir, 'test.ts'), tsTestStr)
          })()
        : copyFile(
          jsTestPaths[sourceModule],
          join(libDirPath, `${mainFileBaseName}.test.js`)
        )
      )
    ])
  }
}

export default codeFiles
