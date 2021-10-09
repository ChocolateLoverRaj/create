import { Task } from '../../dependency-queue'
import promptBoolean from '../../promptBoolean'
import promptReact from './promptReact'
import promptTypeScript from './promptTypeScript'
import promptWillBePublished from './promptWillBePublished'

export enum Docs {
  NONE,
  TYPEDOC,
  STORYBOOK
}

const promptDocs: Task<Promise<Docs>, [boolean, boolean, boolean]> = {
  dependencies: [promptWillBePublished, promptTypeScript, promptReact],
  fn: async (willBePublished, isTs, isReact) => {
    if (willBePublished && isTs) {
      if (isReact) {
        if (await promptBoolean(
          'Would you like to generate documentation using Storybook?', true)) {
          return Docs.STORYBOOK
        }
      } else if (
        await promptBoolean('Would you like to generate documentation using typedoc?', true)) {
        return Docs.TYPEDOC
      }
    }
    return Docs.NONE
  }
}

export default promptDocs
