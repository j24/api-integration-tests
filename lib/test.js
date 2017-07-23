const glob = require('glob')
const path = require('path')
const request = require('request')

function test(flags) {
  const apispecFiles = glob.sync(path.join(__dirname, 'api-specs/**/*'))
  const { domain, ecosystem, include } = flags
  const options = {
    json: true,
    method: 'GET',
    url: `https://mkcma1z3e9.execute-api.eu-central-1.amazonaws.com/prod/microservices/${ecosystem}`
  }

  const promise = new Promise((resolve, reject) => {
    request(options, (err, res, microservices) => {
      if (err) {
        return reject(err)
      }
      if (res.statusCode === 404) {
        return reject(new Error('Not found'))
      }
      if (res.statusCode === 200) {
        console.log(microservices)

        console.log('Found %s apispec files:', apispecFiles.length)
        for (const file of apispecFiles) {
          console.log('- %s', file)
          const spec = require(file)
          spec.callback()
        }

        resolve()
      }
    })
  })

  return promise
}

module.exports = test
