import { createFsFromVolume, Volume } from 'memfs'
import { Union } from 'unionfs'
import realFs from 'fs'

const fs = new Union()
  .use(createFsFromVolume(new Volume({

  })) as any)
  .use(realFs)

export = fs
