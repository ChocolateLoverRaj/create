import getTaskDependencies from './getTaskDependencies'
import getTaskFn from './getTaskFn'
import { AnyTask, OneByOne, TaskResults } from './types'

/**
 * Queue a list of tasks that depend on other tasks.
 */
const oneByOne = async (...tasks: Array<AnyTask<any, OneByOne>>): Promise<TaskResults> => {
  const taskResults: TaskResults = new Map()
  for (const task of tasks) {
    taskResults.set(
      task,
      await getTaskFn(task)(
        ...getTaskDependencies<OneByOne>(task).map(dependency => taskResults.get(dependency))
      )
    )
  }
  return taskResults
}

export default oneByOne
