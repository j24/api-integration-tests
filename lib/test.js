const console = require('./common/console')
const glob = require('glob')
const isSubset = require('./common/is-subset')
const mocha = require('./common/mocha')
const path = require('path')

function test(domain, microservices) {
  // Set environment variable such that tests can use the correct domain
  process.env.domain = domain

  // Fetch meta information for tests, i.e. test file paths and dependencies
  const metaFiles = glob.sync(path.join(__dirname, 'api-specs/**/*.meta.apispec.js'))

  // Filter out the tests which are incompatible with given microservices
  const apispecFiles = metaFiles
    .filter((file) => {
      const deps = require(file).dependencies
      return isSubset(deps, microservices)
    })
    .map((file) => require(file).file)

  console.log('Found %s compatible tests.', apispecFiles.length)

  // Run compatible tests
  for (const apispecFile of apispecFiles) {
    mocha.addFile(apispecFile)
  }

  mocha.run((failures) => {
    process.on('exit', function () {
      process.exit(failures)
    })
  })
}

module.exports = test
