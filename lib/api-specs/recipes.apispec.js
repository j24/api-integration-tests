/* eslint-disable no-undef */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiMatchPattern = require('chai-match-pattern')
const chalk = require('chalk')
const requestBase = require('request-promise-native')

// Global variables and instructions
chai.use(chaiAsPromised)
chai.use(chaiMatchPattern)
const _ = chaiMatchPattern.getLodashModule()
const expect = chai.expect

const domain = process.env.domain
const randomToken = process.env.randomToken
const userId = `dokime-${randomToken}`
var request = requestBase.defaults({
  baseUrl: domain,
  json: true,
  resolveWithFullResponse: true
})

describe('creates a user with recipes and destroys it all', () => {
  let id

  describe('users/v1', () => {
    it('POST users/v1', async () => {
      const body = {
        data: {
          id: userId
        }
      }
      const res = await request.post('users/v1', { body })
      expect(res).to.have.property('statusCode', 201)
      expect(res.body).to.have.deep.property('data.id', userId)
      expect(res.body).to.have.deep.property('data.token')
        // Set Authorization header as default for subsequent requests
        request = request.defaults({
          headers: {
            Authorization: res.body.data.token
          }
        })
        // Display token in console for debugging purposes
        console.log(chalk.gray(`    User token: ${res.body.data.token}`))
    })
  })

  describe('recipes/v1', () => {
    it('GET  recipes/v1/me', async () => {
      const res = await request.get('recipes/v1/me')
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.deep.equal({
        data: []
      })
    })

    it('GET  recipes/v1/me/00000000-0000-0000-0000-000000000000', async () => {
      expect(request.get('recipes/v1/me/00000000-0000-0000-0000-000000000000')).to.be.rejectedWith({ statusCode: 404 })
    })

    it('POST recipes/v1/me', async () => {
      const body = {
        data: {
          attributes: {
            name: 'kirk'
          },
          type: 'recipes'
        }
      }
      const res = await request.post('recipes/v1/me', { body })
      expect(res).to.have.property('statusCode', 201)
      expect(res.body).to.matchPattern({
        data: {
          attributes: {
            name: 'kirk'
          },
          id: _.isString,
          type: 'recipes'
        }
      })
      // Set id for reuse in the following requests
      id = res.body.data.id
      console.log(chalk.gray(`    recipes resource id: ${id}`))
    })

    it('GET  recipes/v1/me', async () => {
      const res = await request.get('recipes/v1/me')
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.matchPattern({
        data: [{
          attributes: {
            name: 'kirk'
          },
          id: _.isString,
          type: 'recipes'
        }]
      })
    })

    it('GET  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
      const res = await request.get(`recipes/v1/me/${id}`)
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.deep.equal({
        data: {
          attributes: {
            name: 'kirk'
          },
          id,
          type: 'recipes'
        }
      })
    })

    it('DEL  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
      const res = await request.delete(`recipes/v1/me/${id}`)
      expect(res).to.have.property('statusCode', 204)
    })

    it('GET  recipes/v1/me', async () => {
      const res = await request.get('recipes/v1/me')
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.deep.equal({
        data: []
      })
    })

    it('GET  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
      expect(request.get(`recipes/v1/me/${id}`)).to.be.rejectedWith({ statusCode: 404 })
    })
  })

  describe('users/v1', () => {
    it('DEL  users/v1/me', async () => {
      const res = await request.delete('users/v1/me')
      expect(res).to.have.property('statusCode', 204)
    })

    describe('recipes/v1/me', () => {
      it('GET  recipes/v1/me', async () => {
        expect(request.get('recipes/v1/me')).to.be.rejectedWith({ statusCode: 401 })
      })

      it('GET  recipes/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
        expect(request.get(`recipes/v1/me/${id}`)).to.be.rejectedWith({ statusCode: 401 })
      })
    })
  })
})
