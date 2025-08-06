module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New functionality
        'fix',      // Bug fixes
        'docs',     // Documentation changes
        'style',    // Format changes (spaces, commas, etc)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Add or fix tests
        'build',    // Build system changes
        'ci',       // CI configuration changes
        'chore',    // Maintenance tasks
        'revert'    // Revert previous commits
      ]
    ],
    // Maximum subject length
    'subject-max-length': [2, 'always', 100],
    // Subject should not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Subject should start with lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // Scope is optional but if used should be lowercase
    'scope-case': [2, 'always', 'lower-case'],
    // Body should have blank line before
    'body-leading-blank': [2, 'always'],
    // Footer should have blank line before
    'footer-leading-blank': [2, 'always']
  }
};