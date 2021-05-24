import { join } from 'path'
import libDirPath from './libDirPath'
import mainFileName from './mainFileName'

const mainFilePath = join(libDirPath, mainFileName)

export default mainFilePath
