import mainFileBaseName from './mainFileBaseName'
import mainFileNameJs from './mainFileNameJs'
import mainFileNameTs from './mainFileNameTs'

const getMainFileName = (ts = false, react = false): string => ts
  ? react ? `${mainFileBaseName}.tsx` : mainFileNameTs
  : mainFileNameJs

export default getMainFileName
