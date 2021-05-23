import pathExists from 'path-exists'
import { Task } from '../../dependency-queue'
import promptReplaceFile from '../../promptReplaceFile'

const shouldWriteReadme: Task<Promise<boolean>, []> = async () => {
  const readmeExists = await pathExists('README.md')
  if (readmeExists) console.log('Detected README.md')
  return !readmeExists || await promptReplaceFile('README.md')
}

export default shouldWriteReadme
