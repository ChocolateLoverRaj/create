import { Task } from '../../dependency-queue'
import promptBoolean from '../../promptBoolean'

const promptWillBePublished: Task<Promise<boolean>, []> = async () =>
  await promptBoolean('Will this package be published?', true)

export default promptWillBePublished
