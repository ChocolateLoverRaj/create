import getTaskDependencies from './getTaskDependencies'
import getTaskFn from './getTaskFn'
import { afterAll } from './symbols'
import { AnyTask, FastestParallel, TaskResults } from './types'
import { PredefinedPromise } from 'predefined-promise'

/**
 * Queue a list of tasks that depend on other tasks.
 */
const fastestParallel = async (
  tasks: Array<AnyTask<any, FastestParallel>>,
  previousTaskResults?: TaskResults
): Promise<TaskResults> => {
  const dependenciesPromises: Array<Promise<unknown>> = []
  const taskResults = new Map<AnyTask, Promise<any>>()
  const afterAllPP = new PredefinedPromise<void>()
  const afterAllPromise = afterAllPP.wait()
  for (const task of tasks) {
    const dependenciesPromise = Promise.all(
      getTaskDependencies(task).map(dependency => dependency === afterAll
        ? afterAll
        : taskResults.has(dependency)
          ? taskResults.get(dependency)
          : previousTaskResults?.get(dependency)
      )
    )
    dependenciesPromises.push(dependenciesPromise)
    taskResults.set(
      task,
      dependenciesPromise.then(dependencies => getTaskFn(task)(...dependencies.map(
        dependency => dependency === afterAll ? afterAllPromise : dependency
      )))
    )
  }
  await Promise.all(dependenciesPromises)
  afterAllPP.resolve()
  return taskResults
}

export default fastestParallel
