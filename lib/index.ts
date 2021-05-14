#!/usr/bin/env node
import { Command } from 'commander'
import { readFileSync } from 'jsonfile'
import { join } from 'path'
import create from './commands/create'

const packageJsonPath = join(__dirname, '../package.json')

const main = new Command()
  .version(readFileSync(packageJsonPath).version, '-v, --version')
  .action(create)
  .allowExcessArguments(false)

main
  .command('create')
  .action(create)

main.parse(process.argv)
