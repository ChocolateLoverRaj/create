import { Task } from '../../dependency-queue'
import { ProjectType } from '../../projectTypes'
import promptSelect from '../../promptSelect'

const promptProjectType: Task<Promise<ProjectType>, []> = async () =>
  await promptSelect<ProjectType>('What type of project is this?', [{
    value: 'runFile',
    description: 'Basically a script that runs `node mainFile.js`'
  }, {
    value: 'package',
    description: 'A reusable npm package'
  }, {
    value: 'ghAction',
    description: 'A GitHub Action script'
  }], 1)

export default promptProjectType
