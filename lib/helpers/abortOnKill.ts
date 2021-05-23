// Based on https://github.com/terkelg/prompts/issues/252#issue-559780869
interface PromptState {
  aborted: boolean
}

const enableTerminalCursor = (): void => {
  process.stdout.write('\x1B[?25h')
}

/**
 * Use as onState in prompts()
 */
const abortOnKill = (state: PromptState): void => {
  if (state.aborted) {
    enableTerminalCursor()
    process.stdout.write('\n')
    console.log('Aborting Process')
    process.exit()
  }
}

export default abortOnKill
