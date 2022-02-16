import { Task } from '../../dependency-queue'
import exists from 'path-exists'
import { join } from 'path'

const packageJsonExists: Task<void, []> = async () => {
  if (await exists(join(process.cwd(), 'package.json'))) {
    console.log('Projects with existing package.json not supported yet.')
    process.exit(0)
  }
}

export default packageJsonExists
