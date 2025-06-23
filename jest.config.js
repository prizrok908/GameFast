module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '^axios$': '<rootDir>/__mocks__/axios.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './.babelrc' }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios|@babel/runtime)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__broken__/',
    '\\.test\\.broken\\.js$'
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}'
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true,
  testTimeout: 10000,
  moduleDirectories: ['node_modules', 'src']
}; 