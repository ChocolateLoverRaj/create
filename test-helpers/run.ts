import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import concat from 'concat-stream'

export default async function (
  args: string[],
  inputs: string[] = [],
  options?: SpawnOptionsWithoutStdio,
  timeout = 200
): Promise<string> {
  const proc = spawn('node', args, options)
  proc.stdin.setDefaultEncoding('utf-8')

  let handle: NodeJS.Timeout

  // TODO: Currently it writes every 200 ms or timeout, but it should figure out when
  // the input is ready. This will make it not too fast or too slow, and will
  // work on slow computers
  const loop = function (inputs: string[]): void {
    if (inputs.length > 0) {
      handle = setTimeout(function () {
        proc.stdin.write(inputs[0])
        loop(inputs.slice(1))
      }, timeout)
    } else {
      proc.stdin.end()
    }
  }

  loop(inputs)

  return new Promise(function (resolve, reject) {
    proc.once('exit', code => {
      clearTimeout(handle)
      if (code === 0) resolve(stdoutResult)
      else {
        reject(new Error(
          `Process exited with code: ${code ?? 'null'}\n\nStderr below:\n${stderrResult}`
        ))
      }
    })
    let stdoutResult: string
    proc.stdout.pipe(concat(function (result) {
      stdoutResult = result.toString()
    }))
    let stderrResult: string
    proc.stderr.pipe(concat(result => {
      stderrResult = result.toString()
    }))
  })
}

export const DOWN = '\x1B\x5B\x42'
export const UP = '\x1B\x5B\x41'
export const ENTER = '\x0D'
