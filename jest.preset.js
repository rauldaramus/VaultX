const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageReporters: ['html', 'text', 'lcov'],
  collectCoverage: false,
  testTimeout: 10000,
};
