import { Task } from '../../dependency-queue'
import { Module } from '../../modules'
import promptSourceModule from '../prompts/promptSourceModule'
import { join } from 'path'
import resPath from '../../resPath'
import { mkdir, copyFile, readFile, writeFile } from 'fs/promises'
import promptWillBePublished from '../prompts/promptWillBePublished'
import libDirPath from '../../libDirPath'
import promptTypeScript from '../prompts/promptTypeScript'
import getMainFileName from '../../getMainFileName'
import { Test } from '../../tests'
import promptTests from '../prompts/promptTests'
import mainFileBaseName from '../../mainFileBaseName'
import testDir from './testDir'
import pupa from 'pupa'
import mainFileNameJs from '../../mainFileNameJs'
import promptReact from '../prompts/promptReact'
import promptDocs, { Docs } from '../prompts/promptDocs'

const jsLibraryPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'library.cjs'),
  ESModules: join(resPath, 'library.mjs')
}
const mochaJsTestPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'mochaTest.cjs'),
  ESModules: join(resPath, 'mochaTest.mjs')
}
const jestJsTestPaths: Record<Module, string> = {
  CommonJS: join(resPath, 'jestTest.cjs'),
  ESModules: join(resPath, 'jestTest.mjs')
}

const privateProjectPath = join(resPath, 'private.js')
const tsLibraryPath = join(resPath, 'library.ts')
const mochaTsTestPath = join(resPath, 'mochaTestTs.txt')
const jestTsTestPath = join(resPath, 'jestTestTs.txt')
const jestTsReactTestPath = join(resPath, 'jestTestTsReact.txt')
const tsReactLibraryPath = join(resPath, 'react.txt')
const tsReactLibraryStoryPath = join(resPath, 'story.txt')

const codeFiles: Task<void, [boolean, Module, boolean, Test, boolean, Docs]> = {
  dependencies: [
    promptWillBePublished,
    promptSourceModule,
    promptTypeScript,
    promptTests,
    promptReact,
    promptDocs
  ],
  fn: async (isLibrary, sourceModule, ts, test, react, docs) => {
    await mkdir(libDirPath)
    await Promise.all<unknown>([
      copyFile(
        isLibrary
          ? ts
            ? react
              ? tsReactLibraryPath
              : tsLibraryPath
            : jsLibraryPaths[sourceModule]
          : privateProjectPath,
        join(libDirPath, getMainFileName(ts, react))
      ),
      isLibrary && test === 'mocha' && (ts
        ? (async () => {
            await mkdir(testDir)
            const tsTestTemplate = await readFile(mochaTsTestPath, 'utf8')
            const tsTestStr = pupa(tsTestTemplate, { libDirPath })
            await writeFile(join(testDir, 'test.ts'), tsTestStr)
          })()
        : copyFile(
          mochaJsTestPaths[sourceModule],
          join(libDirPath, `${mainFileBaseName}.test.js`)
        )
      ),
      isLibrary && test === 'jest' && (async () => {
        const testDir = join(libDirPath, '__tests__')
        await mkdir(testDir)
        const template = await readFile(ts
          ? react ? jestTsReactTestPath : jestTsTestPath
          : jestJsTestPaths[sourceModule], 'utf8')
        const testStr = pupa(template, {
          mainFileBaseName,
          mainFilePath: `../${mainFileNameJs}`
        })
        await writeFile(join(testDir,
          `${mainFileBaseName}.test.${ts ? `ts${react ? 'x' : ''}` : 'js'}`), testStr)
      })(),
      docs === Docs.STORYBOOK &&
        copyFile(tsReactLibraryStoryPath, join(libDirPath, `${mainFileBaseName}.stories.tsx`))
    ])
  }
}

export default codeFiles
