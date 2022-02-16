import { Task } from '../../dependency-queue'
import modules, { Module } from '../../modules'
import promptSelectMulti from '../../promptSelectMulti'

const defaultModules = new Set<Module>()
  .add('CommonJS')
  .add('ESModules')

const promptTargetModules: Task<Promise<Set<Module>>, []> = async () =>
  new Set(await promptSelectMulti('What modules will be published?', modules.map(module => ({
    title: module,
    value: module,
    selected: defaultModules.has(module)
  })), 1))

export default promptTargetModules
