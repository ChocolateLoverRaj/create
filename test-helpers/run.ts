import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import concat from 'concat-stream'
import { once } from 'events'
import { removeAnsi } from 'ansi-parser'

export default async (
  args: string[],
  inputs: string[] = [],
  options?: SpawnOptionsWithoutStdio
): Promise<string> => {
  const proc = spawn('node', args, options)
  proc.stdin.setDefaultEncoding('utf-8')

  let stdoutResult = ''
  proc.stdout.pipe(concat(function (result) {
    stdoutResult = result.toString()
  }))
  let stderrResult = ''
  proc.stderr.pipe(concat(result => {
    stderrResult = result.toString()
  }))
  return new Promise((resolve, reject) => {
    (async () => {
      for (let i = 0; i < inputs.length; i++) {
        let lastStr = ''
        while (true) {
          const [data] = await once(proc.stdout, 'data') as [Buffer]
          const str = data.toString()
          // Annoying ANSI escapes:
          // https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#erase-functions
          const visibleStr = str.slice(str.lastIndexOf('\x1b[2K'))
          const visibleStrText = removeAnsi(visibleStr)
            // Ignore select inputs
            .replace('>', ' ')
            // Ignore multi select inputs
            .replace('(*)', '( )')
          const shouldAnswer = visibleStr.includes('\u00BB') && lastStr !== visibleStrText
          // console.log([visibleStrText], shouldAnswer, i, inputs.length)
          lastStr = visibleStrText
          if (shouldAnswer) break
        }
        proc.stdin.write(inputs[i])
      }
      proc.stdin.end()
      // console.log('Done with prompts')
    })().catch(reject);
    (async () => {
      const [code] = await once(proc, 'exit') as [number]
      if (code === 0) return stdoutResult
      else {
        throw new Error(
        `Process exited with code: ${code}\n\nStderr below:\n${stderrResult}`
        )
      }
    })().then(resolve, reject)
  })
}

export const DOWN = '\x1B\x5B\x42'
export const UP = '\x1B\x5B\x41'
export const ENTER = '\x0D'
