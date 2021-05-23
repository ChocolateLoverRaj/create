import prompts from 'prompts'
import abortOnKill from '../../abortOnKill'
import codeLints, { CodeLint } from '../../codeLints'
import { Task } from '../../dependency-queue'

const promptCodeLint: Task<Promise<CodeLint>, []> = async () => (await prompts({
  message: 'What style code lint should be used?',
  name: 'main',
  type: 'select',
  choices: codeLints.map(name => ({ title: name, value: name })),
  initial: 1,
  onState: abortOnKill
})).main

export default promptCodeLint
