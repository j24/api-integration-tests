/* eslint-disable no-undef */
const chai = require('chai')
const chaiMatchPattern = require('chai-match-pattern')
const chalk = require('chalk')
const requestBase = require('request')

// Global variables and instructions
chai.use(chaiMatchPattern)
const _ = chaiMatchPattern.getLodashModule()
const expect = chai.expect

const domain = process.env.domain
const randomToken = process.env.randomToken
const userId = `dokime-${randomToken}`
var request = requestBase.defaults({
  baseUrl: domain,
  json: true
})

describe.only('creates a user with recipes and destroys it all', () => {
  let id

  describe('users/v1', () => {
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
  })

  describe('recipes/v1', () => {
    it('GET  recipes/v1/me', (done) => {
      request.get('recipes/v1/me', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.deep.equal({
          data: []
        })
        done()
      })
    })

    it('GET  recipes/v1/me/default', (done) => {
      request.get('recipes/v1/me/default', (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 404)
        done()
      })
    })

    it('POST recipes/v1/me', (done) => {
      const body = {
        data: {
          attributes: {
            name: 'kirk'
          },
          type: 'recipes'
        }
      }
      request.post('recipes/v1/me', { body }, (err, res, userProfile) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 201)
        expect(userProfile).to.matchPattern({
          data: {
            attributes: {
              name: 'kirk'
            },
            id: _.isString,
            type: 'recipes'
          }
        })
        // Set id for reuse in the following requests
        id = userProfile.data.id
        console.log(chalk.gray(`    recipes resource id: ${id}`))
        done()
      })
    })

    it('GET  recipes/v1/me', (done) => {
      request.get('recipes/v1/me', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.matchPattern({
          data: [{
            attributes: {
              name: 'kirk'
            },
            id: _.isString,
            type: 'recipes'
          }]
        })
        done()
      })
    })

    it('GET  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', (done) => {
      request.get(`recipes/v1/me/${id}`, (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.deep.equal({
          data: {
            attributes: {
              name: 'kirk'
            },
            id,
            type: 'recipes'
          }
        })
        done()
      })
    })

    it('DEL  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', (done) => {
      request.delete(`recipes/v1/me/${id}`, (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 204)
        done()
      })
    })

    it('GET  recipes/v1/me', (done) => {
      request.get('recipes/v1/me', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.deep.equal({
          data: []
        })
        done()
      })
    })

    it('GET  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', (done) => {
      request.get(`recipes/v1/me/${id}`, (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 404)
        done()
      })
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

    describe('recipes/v1/me', () => {
      it('GET  recipes/v1/me', (done) => {
        request.get('recipes/v1/me', (err, res) => {
          expect(err).to.be.null
          expect(res).to.have.property('statusCode', 401)
          done()
        })
      })

      it('GET  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', (done) => {
        request.get(`recipes/v1/me/${id}`, (err, res) => {
          expect(err).to.be.null
          expect(res).to.have.property('statusCode', 401)
          done()
        })
      })
    })
  })
})
