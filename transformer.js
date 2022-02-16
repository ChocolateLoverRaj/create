const { mock } = require('jest-mock-imports')

exports.process = mock({
  modules: new Map()
    .set('fs/promises', 'fs/promises.ts')
    .set('fs', 'fs.ts'),
  files: new Set([])
})
