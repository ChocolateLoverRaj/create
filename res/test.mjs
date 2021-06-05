/* eslint-env mocha */
import amazingLibrary from './index'
import { strictEqual } from 'assert'

it('is amazing', () => {
  strictEqual(amazingLibrary, 3)
})
