const glob = require('glob')
const isSubset = require('./is-subset')
const path = require('path')

function test(domain, microservices) {
  const apispecFiles = glob.sync(path.join(__dirname, 'api-specs/**/*'))
  const testCases = apispecFiles
    .filter((file) => {
      const deps = require(file).dependencies
      return isSubset(deps, microservices)
    })
    .map((file) => require(file).callback)

  for (const testCase of testCases) {
    testCase(domain)
  }
}

module.exports = test
