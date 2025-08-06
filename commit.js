#!/usr/bin/env node

const inquirer = require('inquirer').default;
const { execSync } = require('child_process');

const types = [
  { value: 'feat', name: 'feat:     ✨ New feature' },
  { value: 'fix', name: 'fix:      🐛 Bug fix' },
  { value: 'docs', name: 'docs:     📚 Documentation only changes' },
  { value: 'style', name: 'style:    💄 Changes that do not affect the meaning of the code' },
  { value: 'refactor', name: 'refactor: ♻️  A code change that neither fixes a bug nor adds a feature' },
  { value: 'perf', name: 'perf:     ⚡️ A code change that improves performance' },
  { value: 'test', name: 'test:     ✅ Adding missing tests or correcting existing tests' },
  { value: 'build', name: 'build:    📦 Changes that affect the build system or external dependencies' },
  { value: 'ci', name: 'ci:       🔧 Changes to our CI configuration files and scripts' },
  { value: 'chore', name: 'chore:    🔨 Other changes that don\'t modify src or test files' },
  { value: 'revert', name: 'revert:   ⏪ Reverts a previous commit' }
];

async function commit() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select the type of change that you\'re committing:',
        choices: types
      },
      {
        type: 'input',
        name: 'scope',
        message: 'What is the scope of this change (e.g. component or file name): (press enter to skip)'
      },
      {
        type: 'input',
        name: 'subject',
        message: 'Write a short, imperative tense description of the change:',
        validate: function(value) {
          if (value.length > 100) {
            return 'Subject must be 100 characters or less';
          }
          return value.length > 0 || 'Subject is required';
        }
      },
      {
        type: 'input',
        name: 'body',
        message: 'Provide a longer description of the change: (press enter to skip)'
      },
      {
        type: 'input',
        name: 'footer',
        message: 'Any breaking changes or issues closed: (press enter to skip)'
      }
    ]);

    const scope = answers.scope ? `(${answers.scope.toLowerCase()})` : '';
    const subject = answers.subject.charAt(0).toLowerCase() + answers.subject.slice(1);
    const commitMessage = `${answers.type}${scope}: ${subject}`;
    
    let fullMessage = commitMessage;
    if (answers.body) {
      fullMessage += `\n\n${answers.body}`;
    }
    if (answers.footer) {
      fullMessage += `\n\n${answers.footer}`;
    }

    console.log('\nCommit message:');
    console.log('================');
    console.log(fullMessage);
    console.log('================');

    const confirm = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to commit with this message?',
      default: true
    }]);

    if (confirm.confirm) {
      execSync(`git commit -m "${fullMessage}"`, { stdio: 'inherit' });
      console.log('✅ Commit successful!');
    } else {
      console.log('❌ Commit cancelled');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

commit();