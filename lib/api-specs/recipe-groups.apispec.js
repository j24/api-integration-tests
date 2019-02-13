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

describe('creates a user with recipe-groups and destroys it all', () => {
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

  describe('recipe-groups/v1', () => {
    it('GET  recipe-groups/v1/me', async () => {
      const res = await request.get('recipe-groups/v1/me')
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.deep.equal({
        data: []
      })
    })

    it('GET  recipe-groups/v1/me/00000000-0000-0000-0000-000000000000', async () => {
      expect(request.get('recipe-groups/v1/me/00000000-0000-0000-0000-000000000000')).to.be.rejectedWith({ statusCode: 404 })
    })

    it('POST recipe-groups/v1/me', async () => {
      const body = {
        data: {
          attributes: {
            name: 'kirk'
          },
          relationships: {
            owner: {
              id: userId,
              type: 'users'
            }
          },
          type: 'recipe-groups'
        }
      }
      const res = await request.post('recipe-groups/v1/me', { body })
      expect(res).to.have.property('statusCode', 201)
      expect(res.body).to.matchPattern({
        data: {
          attributes: {
            name: 'kirk'
          },
          relationships: {
            owner: {
              id: userId,
              type: 'users'
            }
          },
          id: _.isString,
          type: 'recipe-groups'
        }
      })
      // Set id for reuse in the following requests
      id = res.body.data.id
      console.log(chalk.gray(`    recipe-groups resource id: ${id}`))
    })

    it('GET  recipe-groups/v1/me', async () => {
      const res = await request.get('recipe-groups/v1/me')
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.matchPattern({
        data: [{
          attributes: {
            name: 'kirk'
          },
          relationships: {
            owner: {
              id: userId,
              type: 'users'
            }
          },
          id: _.isString,
          type: 'recipe-groups'
        }]
      })
    })

    it('GET  recipe-groups/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
      const res = await request.get(`recipe-groups/v1/me/${id}`)
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.deep.equal({
        data: {
          attributes: {
            name: 'kirk'
          },
          relationships: {
            owner: {
              id: userId,
              type: 'users'
            }
          },
          id,
          type: 'recipe-groups'
        }
      })
    })

    it('DEL  recipe-groups/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
      const res = await request.delete(`recipe-groups/v1/me/${id}`)
      expect(res).to.have.property('statusCode', 204)
    })

    it('GET  recipe-groups/v1/me', async () => {
      const res = await request.get('recipe-groups/v1/me')
      expect(res).to.have.property('statusCode', 200)
      expect(res.body).to.deep.equal({
        data: []
      })
    })

    it('GET  recipe-groups/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
      expect(request.get(`recipe-groups/v1/me/${id}`)).to.be.rejectedWith({ statusCode: 404 })
    })
  })

  describe('users/v1', () => {
    it('DEL  users/v1/me', async () => {
      const res = await request.delete('users/v1/me')
      expect(res).to.have.property('statusCode', 204)
    })

    describe('recipe-groups/v1/me', () => {
      it('GET  recipe-groups/v1/me', async () => {
        expect(request.get('recipe-groups/v1/me')).to.be.rejectedWith({ statusCode: 401 })
      })

      it('GET  recipe-groups/v1/me/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', async () => {
        expect(request.get(`recipe-groups/v1/me/${id}`)).to.be.rejectedWith({ statusCode: 401 })
      })
    })
  })
})
