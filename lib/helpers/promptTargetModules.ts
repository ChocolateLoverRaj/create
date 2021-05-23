import prompts from 'prompts'
import abortOnKill from './abortOnKill'
import modules, { Module } from './modules'

const defaultModules = new Set<Module>()
  .add('CommonJS')
  .add('ESModules')

const promptTargetModules = async (): Promise<Module[]> => (await prompts({
  name: 'main',
  message: 'What modules will be published?',
  // cspell:disable-next
  type: 'multiselect',
  choices: modules.map(module => ({
    title: module,
    value: module,
    selected: defaultModules.has(module)
  })),
  min: 1,
  onState: abortOnKill
})).main

export default promptTargetModules
