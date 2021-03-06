/* eslint-disable no-undef */
const chai = require('chai')
const chalk = require('chalk')
const requestBase = require('request')

// Global variables and instructions
const expect = chai.expect

const domain = process.env.domain
const randomToken = process.env.randomToken
const userId = `dokime-${randomToken}`
var request = requestBase.defaults({
  baseUrl: domain,
  json: true
})

describe('creates a user and destroys it', () => {
  it('POST users/v1', (done) => {
    const body = {
      data: {
        id: userId
      }
    }
    request.post('users/v1', { body }, (err, res, { data }) => {
      expect(err).to.be.null
      expect(res).to.have.property('statusCode', 201)
      expect(data).to.have.property('id', userId)
      expect(data).to.have.property('token')
      // Set Authorization header as default for subsequent requests
      request = request.defaults({
        headers: {
          Authorization: data.token
        }
      })
      // Display token in console for debugging purposes
      console.log(chalk.gray(`    User token: ${data.token}`))
      done()
    })
  })

  it('DEL  users/v1/me', (done) => {
    request.delete('users/v1/me', (err, res) => {
      expect(err).to.be.null
      expect(res).to.have.property('statusCode', 204)
      done()
    })
  })
})
