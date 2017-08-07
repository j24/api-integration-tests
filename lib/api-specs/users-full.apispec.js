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

describe('creates a user with profile & preferences and destroys it all', () => {
  describe('users/v1', () => {
    it('POST users/v1', (done) => {
      const body = { id: userId }
      request.post('users/v1', { body }, (err, res, user) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 201)
        expect(user).to.have.property('id', userId)
        expect(user).to.have.property('token')
        // Set Authorization header as default for subsequent requests
        request = request.defaults({
          headers: {
            Authorization: user.token
          }
        })
        // Display token in console for debugging purposes
        console.log(chalk.gray(`    User token: ${user.token}`))
        done()
      })
    })
  })

  describe('user-accounts/v1', () => {
    it('GET  user-accounts/v1/me', (done) => {
      request.get('user-accounts/v1/me', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.deep.equal([])
        done()
      })
    })

    it('GET  user-accounts/v1/me/google', (done) => {
      request.get('user-accounts/v1/me/google', (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 404)
        done()
      })
    })
  })

  describe('user-profiles/v1', () => {
    it('GET  user-profiles/v1/me', (done) => {
      request.get('user-profiles/v1/me', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.deep.equal([])
        done()
      })
    })

    it('GET  user-profiles/v1/me/default', (done) => {
      request.get('user-profiles/v1/me/default', (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 404)
        done()
      })
    })

    it('POST user-profiles/v1/me/default', (done) => {
      const body = {
        data: {
          age: 42
        }
      }
      request.post('user-profiles/v1/me/default', { body }, (err, res, userProfile) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 201)
        expect(userProfile).to.be.an('object')
        expect(userProfile).to.have.property('data')
        expect(userProfile.data).to.have.property('age', 42)
        expect(userProfile).to.have.property('venture', 'default')
        expect(userProfile).to.have.property('userId', userId)
        done()
      })
    })

    it('GET  user-profiles/v1/me', (done) => {
      request.get('user-profiles/v1/me', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.be.an('array')
        expect(body.length).to.equal(1)
        expect(body[0]).to.be.an('object')
        expect(body[0]).to.have.property('data')
        expect(body[0].data).to.have.property('age', 42)
        expect(body[0]).to.have.property('venture', 'default')
        expect(body[0]).to.have.property('userId', userId)
        done()
      })
    })

    it('GET  user-profiles/v1/me/default', (done) => {
      request.get('user-profiles/v1/me/default', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.be.an('object')
        expect(body).to.have.property('data')
        expect(body.data).to.have.property('age', 42)
        expect(body).to.have.property('venture', 'default')
        expect(body).to.have.property('userId', userId)
        done()
      })
    })
  })

  describe('user-preferences/v1', () => {
    it('GET  user-preferences/v1/me', (done) => {
      done()
    })

    it('GET  user-preferences/v1/me/default', (done) => {
      done()
    })

    it('POST user-preferences/v1/me/default', (done) => {
      done()
    })

    it('GET  user-preferences/v1/me', (done) => {
      done()
    })

    it('GET  user-preferences/v1/me/default', (done) => {
      done()
    })
  })

  describe('users/v1', () => {
    it('DEL  users/v1/me', (done) => {
      request.delete('users/v1/me', (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 204)
        done()
      })
    })

    describe('user-profiles/v1/me', () => {
      it('GET  user-profiles/v1/me', (done) => {
        done()
      })

      it('GET  user-profiles/v1/me/default', (done) => {
        done()
      })
    })

    describe('user-preferences/v1/me', () => {
      it('GET  user-preferences/v1/me', (done) => {
        done()
      })

      it('GET  user-preferences/v1/me/default', (done) => {
        done()
      })
    })
  })
})
