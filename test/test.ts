import { join } from 'path'
import emptyDir from 'make-empty-dir'
import run, { DOWN, ENTER, UP } from '../test-helpers/run'
import { readFile } from 'jsonfile'

const testDir = join(__dirname, '../test-tmp')

const testSimple = async (): Promise<string[]> => {
  const output = await run([join(__dirname, '../dist/index.js')], [
    // Yes to published
    ENTER,
    // Package name
    'a',
    ENTER,
    // It's okay if 'a' already exists
    DOWN,
    ENTER,
    // Just CommonJS
    DOWN,
    ' ',
    ENTER,
    // No TypeScript
    DOWN,
    ENTER,
    // Written in CommonJS
    ENTER,
    // No code lint
    UP,
    ENTER,
    // No tests
    UP,
    ENTER
  ], {
    cwd: testDir
  }, 400)
  const lines = output.split('\n')
  return lines
}

jest.setTimeout(10000)
describe('detects MIT license', () => {
  const emptyTestDir = async (): Promise<string> => await emptyDir(testDir)
  beforeEach(emptyTestDir)
  afterEach(emptyTestDir)

  // The root dir has LICENSE file, so it should have MIT
  test('prints text', async () => {
    const lines = await testSimple()
    expect(lines[1]).toMatchSnapshot('Detected License Text')
  })
  test('license field in package.json', async () => {
    await testSimple()
    const packageJson = await readFile(join(testDir, 'package.json'))
    expect(packageJson.license).toBe('MIT')
  })
})
