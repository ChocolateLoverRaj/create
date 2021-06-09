import { join } from 'path'
import run, { DOWN, ENTER, UP } from '../test-helpers/run'
import { readFile as readFileJson } from 'jsonfile'
import { readFile, mkdtemp, rm, readdir } from 'fs/promises'
import emptyDir from 'make-empty-dir'

const testDir = join(__dirname, '../test-tmp')
const cliFilePath = join(__dirname, '../dist/index.js')
const tmpDirPrefix = join(testDir, 'test-')

const testSimple = async (cwd: string): Promise<string[]> => {
  const output = await run([cliFilePath], [
    // Yes to published
    ENTER,
    // Package name
    'a' + ENTER,
    // It's okay if 'a' already exists
    DOWN + ENTER,
    // Just CommonJS
    DOWN + ' ' + ENTER,
    // No TypeScript
    DOWN + ENTER,
    // Written in CommonJS
    ENTER,
    // No code lint
    UP + ENTER,
    // No tests
    UP + ENTER
  ], { cwd })
  const lines = output.split('\n')
  return lines
}

beforeAll(async () => await emptyDir(testDir))
jest.setTimeout(120000)
describe('detects MIT license', () => {
  // The root dir has LICENSE file, so it should have MIT
  it('prints text', async () => {
    const cwd = await mkdtemp(tmpDirPrefix)
    const lines = await testSimple(cwd)
    expect(lines[1]).toMatchSnapshot('Detected License Text')
    await rm(cwd, { recursive: true })
  })
  it('license field in package.json', async () => {
    const cwd = await mkdtemp(tmpDirPrefix)
    await testSimple(cwd)
    const packageJson = await readFileJson(join(cwd, 'package.json'))
    expect(packageJson.license).toBe('MIT')
    await rm(cwd, { recursive: true })
  })
})

describe('standard lint', () => {
  it('standard', async () => {
    const cwd = await mkdtemp(tmpDirPrefix)
    await run([cliFilePath], [
      // Yes to published
      ENTER,
      // Package name
      'a',
      ENTER,
      // It's okay if 'a' already exists
      DOWN + ENTER,
      // Just CommonJS
      DOWN,
      ' ',
      ENTER,
      // No TypeScript
      DOWN + ENTER,
      // Written in CommonJS
      ENTER,
      // Standard code lint
      ENTER,
      // No tests
      UP + ENTER,
      // No Github Actions workflows,
      DOWN + ENTER
    ], { cwd })
    await readdir(cwd)
    const packageJson = await readFileJson(join(cwd, 'package.json'))
    // Versions will change based on most recent package versions
    expect(Object.fromEntries(Object.entries(packageJson.devDependencies).map(([k, v]) =>
      [k, '***']))).toMatchSnapshot('dev dependencies')
    // Eslint config file
    await expect(readFile(join(cwd, '.eslintrc.json'), 'utf8')).resolves
      .toMatchSnapshot('.eslintrc.json')
    await rm(cwd, { recursive: true })
  })

  describe('ts-standard', () => {
    it('without mocha', async () => {
      const cwd = await mkdtemp(tmpDirPrefix)
      await run([cliFilePath], [
        // Yes to published
        ENTER,
        // Package name
        'a',
        ENTER,
        // It's okay if 'a' already exists
        DOWN + ENTER,
        // Just CommonJS
        DOWN + ' ' + ENTER,
        // TypeScript
        ENTER,
        // Written in CommonJS
        ENTER,
        // Standard code lint
        ENTER,
        // No tests
        UP + ENTER
      ], { cwd })
      const packageJson = await readFileJson(join(cwd, 'package.json'))
      // Versions will change based on most recent package versions
      expect(Object.fromEntries(Object.entries(packageJson.devDependencies).map(([k]) =>
        [k, '***']))).toMatchSnapshot('dev dependencies')
      // Eslint config file
      await expect(readFile(join(cwd, '.eslintrc.json'), 'utf8')).resolves
        .toMatchSnapshot('.eslintrc.json')
      await rm(cwd, { recursive: true })
    })
    it('with mocha', async () => {
      const cwd = await mkdtemp(tmpDirPrefix)
      await run([cliFilePath], [
        // Yes to published
        ENTER,
        // Package name
        'a',
        ENTER,
        // It's okay if 'a' already exists
        DOWN + ENTER,
        // Just CommonJS
        DOWN + ' ' + ENTER,
        // TypeScript
        ENTER,
        // Written in CommonJS
        ENTER,
        // Standard code lint
        ENTER,
        // Mocha
        ENTER,
        // No GitHub Actions workflows
        DOWN + ENTER
      ], { cwd })
      const packageJson = await readFileJson(join(cwd, 'package.json'))
      // Versions will change based on most recent package versions
      expect(Object.fromEntries(Object.entries(packageJson.devDependencies).map(([k]) =>
        [k, '***']))).toMatchSnapshot('dev dependencies')
      // Eslint config file
      await expect(readFile(join(cwd, '.eslintrc.json'), 'utf8')).resolves
        .toMatchSnapshot('.eslintrc.json')
      // Eslint tsconfig file
      await expect(readFile(join(cwd, 'eslintTsconfig.json'), 'utf8')).resolves
        .toMatchSnapshot('eslintTsconfig.json')
      await rm(cwd, { recursive: true })
    })
  })
})
