import { afterAll } from './symbols'

// OP Type definitions
export type OneByOne = 'oneByOne'
export type FastestParallel = 'fastestParallel'
export type Modes = OneByOne | FastestParallel

export type OnceByOneSpecialDependencies = never
export type FastestParallelSpecialDependencies = typeof afterAll

export type DependencyParams<Dependencies extends unknown[] = any[]> = {
  [K in keyof Dependencies]: Dependencies[K] extends typeof afterAll
    ? Promise<void>
    : Dependencies[K]
}

export type TaskFn<TReturn = any, TDependencies extends unknown[] = any[]> =
  (...dependencies: DependencyParams<TDependencies>) => TReturn

export type DependenciesArray<
  TDependencies extends unknown[] = any[],
  Mode extends Modes = Modes
> = {
  [K in keyof TDependencies]: Mode extends FastestParallel
    ? TDependencies[K] extends typeof afterAll
      ? FastestParallelSpecialDependencies
      : AnyTask<TDependencies[K] | Promise<TDependencies[K]>>
    : AnyTask<TDependencies[K] | Promise<TDependencies[K]>>
}

export interface TaskWithFn<TReturn = any, TDependencies extends unknown[] = any[]> {
  fn: TaskFn<TReturn, TDependencies>
}

export type TaskWithDependencies<
  TDependencies extends unknown[] = any[],
  Mode extends Modes = Modes
> =
  TDependencies extends []
    ? { dependencies?: DependenciesArray<TDependencies, Mode> }
    : { dependencies: DependenciesArray<TDependencies, Mode> }

// If it has dependencies, the 'dependencies' property is required.
// If there are no dependencies, it can be an object without dependencies prop
// or just the fn
export type Task<TReturn, TDependencies extends unknown[], Mode extends Modes = Modes> =
  (
    TaskWithFn<TReturn, TDependencies> &
    TaskWithDependencies<TDependencies, Mode>
  ) |
  (TDependencies extends [] ? TaskFn<TReturn, TDependencies> : never)

// Workaround to having a 'default' TDependencies type
export type AnyTask<TReturn = any, Mode extends Modes = Modes> =
  (TaskWithFn<TReturn> & (
    { dependencies?: DependenciesArray<[], Mode> } |
    { dependencies: DependenciesArray<any[], Mode> }
  )) |
  TaskFn<TReturn>

export type TaskResults = Map<AnyTask, any>
