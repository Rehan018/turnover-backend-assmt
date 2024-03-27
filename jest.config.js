module.exports = {
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
  };
  