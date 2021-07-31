import { Task } from '../../dependency-queue'
import promptBoolean from '../../promptBoolean'
import promptTypeScript from './promptTypeScript'
import promptWillBePublished from './promptWillBePublished'

const promptTypedoc: Task<Promise<boolean>, [boolean, boolean]> = {
  dependencies: [promptWillBePublished, promptTypeScript],
  fn: async (willBePublished, isTs) => willBePublished && isTs &&
    await promptBoolean('Would you like to generate documentation using typedoc?', true)
}

export default promptTypedoc
