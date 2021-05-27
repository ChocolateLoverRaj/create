import mainFileNameJs from './mainFileNameJs'
import mainFileNameTs from './mainFileNameTs'

const getMainFileName = (ts = false): string => ts ? mainFileNameTs : mainFileNameJs

export default getMainFileName
