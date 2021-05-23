import prompts from 'prompts'
import abortOnKill from '../../abortOnKill'
import { Task } from '../../dependency-queue'
import modules, { Module } from '../../modules'

const defaultModules = new Set<Module>()
  .add('CommonJS')
  .add('ESModules')

const promptTargetModules: Task<Promise<Set<Module>>, []> = async () => new Set((await prompts({
  name: 'main',
  message: 'What modules will be published?',
  type: 'multiselect',
  choices: modules.map(module => ({
    title: module,
    value: module,
    selected: defaultModules.has(module)
  })),
  min: 1,
  onState: abortOnKill
})).main)

export default promptTargetModules
