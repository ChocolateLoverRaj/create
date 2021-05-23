import { Task } from '../../dependency-queue'
import exists from 'path-exists'

const packageJsonExists: Task<void, []> = async () => {
  if (await exists('package.json')) {
    console.log('Projects with existing package.json not supported yet.')
    process.exit(0)
  }
}

export default packageJsonExists
