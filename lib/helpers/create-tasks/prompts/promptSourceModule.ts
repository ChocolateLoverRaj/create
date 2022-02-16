import { Task } from '../../dependency-queue'
import { Module } from '../../modules'
import promptSelect from '../../promptSelect'
import promptTargetModules from './promptTargetModules'
import promptTypeScript from './promptTypeScript'

const promptSourceModule: Task<Promise<Module>, [boolean, Set<Module>]> = {
  dependencies: [promptTypeScript, promptTargetModules],
  fn: async (typeScript, targetModules) => {
    if (typeScript) return 'ESModules'
    const esmTarget = targetModules.has('ESModules')
    const cjsTarget = targetModules.has('CommonJS')
    return await promptSelect(
      'What module will this be written in?',
      [{
        value: 'CommonJS',
        disabled: esmTarget,
        description: 'No transformation necessary'
      }, {
        value: 'ESModules',
        description: cjsTarget
          ? esmTarget
            ? 'Source files will be used for `import`ing and \
            source files will also be compiled to CommonJS for `require`ing'
            : 'Source files will be compiled to CommonJS'
          : 'No transformation necessary.'
      }],
      esmTarget ? 1 : 0
    )
  }
}
export default promptSourceModule
