import { Task } from '../../dependency-queue'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import ensureDir from '@appgeist/ensure-dir'
import shouldWriteGithubWorkflow from '../prompts/shouldWriteGithubWorkflow'
import { Workflow } from '../../workflows'
import { Document } from 'yaml'
import { major, minor } from 'semver'

const workflowsDir = '.github/workflows'
const defaultBranch = 'main'
const runsOn = 'ubuntu-latest'
const checkoutVersion = 'v2'
const setupNodeVersion = 'v2'
// TODO: https://github.com/pnpm/action-setup/issues/17
const setupPnpmVersion = 'v2.0.1'
const pnpmVersion = '6.7'

const ghWorkflows: Task<void, [Set<Workflow>]> = {
  dependencies: [shouldWriteGithubWorkflow],
  fn: async (workflows) => {
    if (workflows.size > 0) {
      await ensureDir(workflowsDir)
      const setupSteps = [{
        name: 'Setup Repo',
        uses: `actions/checkout@${checkoutVersion}`
      }, {
        name: 'Setup Node.js',
        uses: `actions/setup-node@${setupNodeVersion}`,
        with: {
          'node-version': `${major(process.version)}.${minor(process.version)}`
        }
      }, {
        name: 'Setup Pnpm',
        uses: `pnpm/action-setup@${setupPnpmVersion}`,
        with: {
          version: pnpmVersion,
          run_install: true
        }
      }]
      // Following steps from https://github.com/eemeli/yaml/issues/211#issuecomment-738281729
      // TODO: https://github.com/eemeli/yaml/issues/296
      const doc = new Document()
      doc.setSchema()
      doc.contents = doc.schema?.createNode({
        name: 'Test',
        on: {
          push: {
            branches: [defaultBranch]
          },
          pull_request: {
            branches: [defaultBranch]
          }
        },
        jobs: {
          ...workflows.has('lint')
            ? {
                lint: {
                  'runs-on': runsOn,
                  steps: [...setupSteps, {
                    name: 'Run Lint',
                    run: 'pnpm lint'
                  }]
                }
              }
            : undefined,
          ...workflows.has('test')
            ? {
                test: {
                  'runs-on': runsOn,
                  steps: [...setupSteps, {
                    name: 'Run Tests',
                    run: 'pnpm test'
                  }]
                }
              }
            : undefined
        }
      })
      await writeFile(join(workflowsDir, 'test.yaml'), doc.toString())
    }
  }
}

export default ghWorkflows
