const chalk = require('chalk')

const prefix = '      '

function start(text) {
  process.stdout.write(`${prefix}${chalk.blue(text)}...`)
}

function success(info = '') {
  process.stdout.write(` ${chalk.green('Done')}. ${info}\n`)
}

function fail(info) {
  process.stdout.write(` ${chalk.red('Failed')}. ${info}\n`)
}

module.exports = { fail, start, success }
