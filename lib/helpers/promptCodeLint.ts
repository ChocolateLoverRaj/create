import prompts from 'prompts'
import abortOnKill from './abortOnKill'
import codeLints, { CodeLint } from './codeLints'

const promptCodeLint = async (): Promise<CodeLint> => (await prompts({
  message: 'What style code lint should be used?',
  name: 'main',
  type: 'select',
  choices: codeLints.map(name => ({ title: name, value: name })),
  initial: 1,
  onState: abortOnKill
})).main

export default promptCodeLint
