import { Module } from './modules'
import { writeFile } from 'jsonfile'
import babelConfigPaths from './babelConfigPaths'

const getBabelConfig = (targetModule: Module): object => ({
  presets: ['@babel/preset-typescript', '@babel/preset-react'],
  plugins: [
    'react-require',
    ...targetModule === 'CommonJS'
      ? ['@babel/plugin-transform-modules-commonjs']
      : []
  ]
})

/**
 * Write babel config for typescript with react
 */
const writeBabelConfig = async (targetModule: Module, only1Config = false): Promise<void> =>
  await writeFile(only1Config ? '.babelrc' : babelConfigPaths[targetModule],
    getBabelConfig(targetModule), { spaces: 2 })

export default writeBabelConfig
