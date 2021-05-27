import prompts from 'prompts'
import abortOnKill from '../../abortOnKill'
import { Task } from '../../dependency-queue'
import { Module } from '../../modules'
import promptTargetModules from './promptTargetModules'
import promptTypeScript from './promptTypeScript'

const promptSourceModule: Task<Promise<Module>, [boolean, Set<Module>]> = {
  dependencies: [promptTypeScript, promptTargetModules],
  fn: async (typeScript, targetModules) => {
    if (typeScript) return 'ESModules'
    const esmTarget = targetModules.has('ESModules')
    const cjsTarget = targetModules.has('CommonJS')
    return (await prompts({
      name: 'main',
      message: 'What module will this be written in?',
      type: 'select',
      choices: [{
        title: 'CommonJS',
        disabled: esmTarget,
        description: 'No transformation necessary',
        value: 'CommonJS'
      }, {
        title: 'ESModules',
        description: cjsTarget
          ? esmTarget
            ? 'Source files will be used for `import`ing and \
            source files will also be compiled to CommonJS for `require`ing'
            : 'Source files will be compiled to CommonJS'
          : 'No transformation necessary.',
        value: 'ESModules'
      }],
      initial: esmTarget ? 1 : 0,
      onState: abortOnKill
    })).main
  }
}
export default promptSourceModule
