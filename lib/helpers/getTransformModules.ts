import { Module } from './modules'

/**
 * Checks if modules have to be transformed to commonjs
 */
const getTransformModules = (targetModules: Set<Module>, sourceModule: Module): boolean =>
  sourceModule === 'ESModules' && targetModules.has('CommonJS')

export default getTransformModules
