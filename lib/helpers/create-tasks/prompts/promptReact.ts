import { Task } from '../../dependency-queue'
import promptBoolean from '../../promptBoolean'
import promptTypeScript from './promptTypeScript'
import promptWillBePublished from './promptWillBePublished'

const promptReact: Task<Promise<boolean>, [boolean, boolean]> = {
  dependencies: [promptWillBePublished, promptTypeScript],
  fn: async (isLibrary, isTs) =>
    isLibrary && isTs && await promptBoolean('Is this a react library?', false)
}

export default promptReact
