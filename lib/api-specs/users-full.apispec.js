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
  describe('user creation', () => {
    it('creates a user', (done) => {
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

  describe('user accounts', () => {
    it('loads all my user accounts of which I have none', (done) => {
      request.get('user-accounts/v1/me', (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.deep.equal([])
        done()
      })
    })

    it('loads my google user account which does not exist', (done) => {
      request.get('user-accounts/v1/me/google', (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 404)
        done()
      })
    })
  })

  describe('user profile creation', () => {
    it('loads all my user profiles of which I have none', (done) => {
      done()
    })

    it('loads my default user profile which does not exist', (done) => {
      done()
    })

    it('creates a default user profile', (done) => {
      done()
    })

    it('loads all my user profiles', (done) => {
      done()
    })

    it('loads my default user profile', (done) => {
      done()
    })
  })

  describe('user preferences creation', () => {
    it('loads all my user preferences of which I have none', (done) => {
      done()
    })

    it('loads my default user preferences which do not exist', (done) => {
      done()
    })

    it('creates default user preferences', (done) => {
      done()
    })

    it('loads all my user preferences', (done) => {
      done()
    })

    it('loads my default user preferences', (done) => {
      done()
    })
  })

  describe('user deletion', () => {
    it('deletes the user', (done) => {
      request.delete('users/v1/me', (err, res) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 204)
        done()
      })
    })

    describe('user profiles', () => {
      it('loads all my user profiles of which I have none', (done) => {
        done()
      })

      it('loads my default user profile which does not exist', (done) => {
        done()
      })
    })

    describe('user preferences', () => {
      it('loads all my user preferences of which I have none', (done) => {
        done()
      })

      it('loads my default user preferences which do not exist', (done) => {
        done()
      })
    })
  })
})

// Create user
  // CreateUser
// User accounts
  // GetEmptyUserAccounts
  // GetNonExistentUserAccountGoogle
// User profiles
  // GetEmptyUserProfiles
  // GetNonExistentUserProfilesDefault
  // CreateUserProfilesDefault
  // GetUserProfiles
  // GetUserProfilesDefault
  // DeleteUserProfilesDefault
  // GetEmptyUserProfiles
  // GetNonExistentUserProfilesDefault
// User preferences
  // GetEmptyUserPreferences
  // GetNonExistentUserPreferencesDefault
  // CreateUserPreferencesDefault
  // GetUserPreferences
  // GetUserPreferencesDefault
  // DeleteUserPreferencesDefault
  // GetEmptyUserPreferences
  // GetNonExistentUserPreferencesDefault
// Delete all of it
  // DeleteUser
  // GetEmptyUserProfiles
  // GetNonExistentUserProfilesDefault
  // GetEmptyUserPreferences
  // GetNonExistentUserPreferencesDefault
