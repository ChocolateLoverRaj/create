import packageNameRegex from 'package-name-regex'
import packageExists from './packageExists'
import promptString from './promptString'

const promptPackageName = async (rejectTakenNames = false): Promise<string> =>
  await promptString('Name of package', async name => packageNameRegex.test(name)
    ? !rejectTakenNames || (!await packageExists(name) || 'Package name taken')
    : 'Invalid package name')

export default promptPackageName
