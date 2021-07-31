import { Document } from 'yaml'

/**
 * Following steps from https://github.com/eemeli/yaml/issues/211#issuecomment-738281729
 * // TODO: https://github.com/eemeli/yaml/issues/296
 */
const yamlToString = (yaml: any): string => {
  const doc = new Document()
  doc.setSchema()
  doc.contents = doc.schema?.createNode(yaml)
  return doc.toString()
}

export default yamlToString
