import { AnyTask, DependenciesArray, Modes } from './types'

const getTaskDependencies = <Mode extends Modes = Modes>(
  task: AnyTask<any, Mode>
): DependenciesArray<any[], Mode> => typeof task === 'function' ? [] : task.dependencies ?? []

export default getTaskDependencies
