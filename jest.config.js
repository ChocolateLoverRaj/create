module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['/test-manual/.', '<rootDir>/test-tmp/'],
  coveragePathIgnorePatterns: ['/node_modules', '<rootDir>/test-tmp/'],
  watchPathIgnorePatterns: ['<rootDir>/test-tmp/']
}
