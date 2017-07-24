/* eslint-disable consistent-return */
const mergeWith = require('lodash.mergewith')
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
        const microservices = mergeWith(dependencies, JSON.parse(include), mergeCustomizer)
        test(`https://${domain}`, microservices)
        return resolve()
      }
    })
  })

  return promise

}

function mergeCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

module.exports = main
