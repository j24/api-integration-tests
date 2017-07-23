const request = require('request')
const test = require('./test')

function main(flags) {
  const { domain, ecosystem, include } = flags
  const options = {
    json: true,
    method: 'GET',
    url: `https://mkcma1z3e9.execute-api.eu-central-1.amazonaws.com/prod/microservices/${ecosystem}`
  }

  const promise = new Promise((resolve, reject) => {
    request(options, (err, res, dependencies) => {
      if (err) {
        return reject(err)
      }
      if (res.statusCode === 404) {
        return reject(new Error('Not found'))
      }
      if (res.statusCode === 200) {
        const microservices = Object.assign({}, dependencies, JSON.parse(include))
        test(domain, microservices)
        resolve()
        return
      }
    })
  })

  return promise

}

module.exports = main
