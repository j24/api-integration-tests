const console = require('./common/console')
const crypto = require('crypto-extra')
const glob = require('glob')
const isSubset = require('./common/is-subset')
const mocha = require('./common/mocha')
const path = require('path')

function test(domain, microservices) {
  // Set environment variables such that tests can use them
  process.env.domain = domain
  process.env.randomToken = crypto.randomString(4, '0123456789')

  // Fetch meta information for tests, i.e. test file paths and dependencies
  const metaFiles = glob.sync(path.join(__dirname, 'api-specs/**/*.meta.apispec.js'))

  // Filter out the tests which are incompatible with given microservices
  const apispecFiles = metaFiles
    .filter((file) => {
      const deps = require(file).dependencies
      return isSubset(deps, microservices)
    })
    .map((file) => require(file).file)

  // Display information about the tests to run
  console.log('Assuming existence of the following microservices:')
  console.log(microservices)
  console.log('Found %s compatible tests.', apispecFiles.length)
  console.log('Running tests against API endpoint %s', domain)


  // Run compatible tests
  for (const apispecFile of apispecFiles) {
    mocha.addFile(apispecFile)
  }

  mocha.run((failures) => {
    process.on('exit', () => {
      process.exitCode = failures
    })
  })
}

module.exports = test
