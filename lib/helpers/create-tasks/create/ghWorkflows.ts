import { Task } from '../../dependency-queue'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import ensureDir from '@appgeist/ensure-dir'
import shouldWriteGithubWorkflow from '../prompts/shouldWriteGithubWorkflow'
import { Workflow } from '../../workflows'
import { major, minor } from 'semver'
import yamlToString from '../../yamlToString'

const workflowsDir = '.github/workflows'
const defaultBranch = 'main'
const runsOn = 'ubuntu-latest'
const checkoutVersion = 'v2'
const setupNodeVersion = 'v2'
// TODO: https://github.com/pnpm/action-setup/issues/17
const setupPnpmVersion = 'v2.0.1'
const pnpmVersion = '6.7'
const detectIncrementVersion = 'v1.2'
const changeStringCaseVersion = 'v2'
const labelManagerVersion = 'v1.0'

const ghWorkflows: Task<void, [Set<Workflow>]> = {
  dependencies: [shouldWriteGithubWorkflow],
  fn: async (workflows) => {
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

    const promises: Array<Promise<void>> = []
    if (workflows.has('test') || workflows.has('lint')) {
      promises.push(writeFile(join(workflowsDir, 'test.yaml'), yamlToString({
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
      })))
    }
    if (workflows.has('release')) {
      const getIncrementId = 'get_increment'
      const capitalizeIncrementId = 'capitalize_increment'
      const githubTokenEnv = {
        // eslint-disable-next-line no-template-curly-in-string
        GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
      }
      const getIncrement = {
        id: getIncrementId,
        name: 'Get Increment',
        uses: `ChocolateLoverRaj/detect-increment@${detectIncrementVersion}`,
        env: githubTokenEnv
      }
      const ghActionsBotEmail = '41898282+github-actions[bot]@users.noreply.github.com'
      const ifIncrement = `steps.${getIncrementId}.outputs.increment != 'none'`
      promises.push(
        writeFile(join(workflowsDir, 'release-preview.yaml'), yamlToString({
          name: 'Release Preview',
          on: {
            pull_request: {
              branches: [defaultBranch]
            }
          },
          jobs: {
            'release-preview': {
              'runs-on': runsOn,
              steps: [...setupSteps, getIncrement, {
                id: capitalizeIncrementId,
                name: 'Capitalize Increment',
                uses: `ASzc/change-string-case-action@${changeStringCaseVersion}`,
                with: {
                  string: `\${{ steps.${getIncrementId}.outputs.increment }}`
                }
              }, {
                name: 'Update Pull Request Labels',
                uses: `ChocolateLoverRaj/label-manager@${labelManagerVersion}`,
                with: {
                  manage: JSON.stringify([
                    'Semver Increment: None',
                    'Semver Increment: Patch',
                    'Semver Increment: Minor',
                    'Semver Increment: Major'
                  ]),
                  // eslint-disable-next-line no-template-curly-in-string
                  set: '["Semver Increment: ${{ steps.capitalize_increment.outputs.capitalized }}"]'
                },
                env: githubTokenEnv
              }]
            }
          }
        })),
        writeFile(join(workflowsDir, 'release.yaml'), yamlToString({
          name: 'Release',
          on: {
            push: {
              branches: [defaultBranch]
            }
          },
          jobs: {
            release: {
              'runs-on': runsOn,
              steps: [...setupSteps, getIncrement, {
                if: ifIncrement,
                name: 'Setup GitHub Author',
                run: [
                  `git config --global user.email "${ghActionsBotEmail}"`,
                  'git config --global user.name "github-actions[bot]'
                ].join('\n')
              }, {
                if: ifIncrement,
                name: 'Semantic Release',
                // eslint-disable-next-line no-template-curly-in-string
                run: 'pnpx release-it ${{ steps.get_increment.outputs.increment }} --ci',
                env: {
                  ...githubTokenEnv,
                  // eslint-disable-next-line no-template-curly-in-string
                  NPM_TOKEN: '${{ secrets.NPM_TOKEN }}'
                }
              }]
            }
          }
        }))
      )
    }
    await Promise.all(promises)
  }
}

export default ghWorkflows
