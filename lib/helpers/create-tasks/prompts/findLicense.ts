import findConfig from 'find-config'
import { readFile } from 'fs/promises'
import { Task } from '../../dependency-queue'
import findLicense from '../../findLicense'
import nullishAnd, { WithUndefined } from '../../nullishAnd'

const findLicenseTask: Task<Promise<string | undefined>, []> = async () => {
  const licensePath = findConfig('LICENSE')
  const licenseContent = await nullishAnd(readFile, licensePath, 'utf8') as WithUndefined<string>
  const licenseName = nullishAnd(findLicense, licenseContent)
  if (licenseName !== undefined) console.log(`Detected license: ${licenseName}`)
  return licenseName
}

export default findLicenseTask
