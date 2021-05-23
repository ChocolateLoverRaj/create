import { promptTasks, createTasks } from '../helpers/create-tasks'
import { fastestParallel, oneByOne } from '../helpers/dependency-queue'

const create = async (): Promise<void> => {
  const promptTaskResults = await oneByOne(...promptTasks)
  await fastestParallel(createTasks, promptTaskResults)
}

export default create
