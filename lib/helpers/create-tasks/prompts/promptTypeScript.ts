import { Task } from '../../dependency-queue'
import promptBoolean from '../../promptBoolean'

const promptTypeScript: Task<Promise<boolean>, []> = async () =>
  await promptBoolean('Will this package be written in TypeScript?', true)

export default promptTypeScript
