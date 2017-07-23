const glob = require('glob')
const path = require('path')

function test(flags) {
  const apispecFiles = glob.sync(path.join(__dirname, 'api-specs/**/*'))

  console.log('Found %s apispec files:', apispecFiles.length)
  for (const file of apispecFiles) {
    console.log('- %s', file)
    const spec = require(file)
    spec.callback()
  }
}

module.exports = test
