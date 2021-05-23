import { AnyTask, TaskFn } from './types'

/**
 * Get either the 'fn' prop from a task or the task itself if the task is a function
 */
const getTaskFn = (task: AnyTask): TaskFn => typeof task === 'function' ? task : task.fn

export default getTaskFn
