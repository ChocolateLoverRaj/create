/* eslint-env mocha */
const amazingLibrary = require('./index')
const { strictEqual } = require('assert')

it('is amazing', () => {
  strictEqual(amazingLibrary, 3)
})
