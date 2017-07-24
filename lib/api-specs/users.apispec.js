const chai = require('chai')
const request = require('request')

// Global variables and instructions
const expect = chai.expect

const domain = process.env.domain
const randomToken = process.env.randomToken
const userId = `dokime-${randomToken}`

it('creates and destroys a user', () => Promise.resolve()
  .then(createUser)
  .then(deleteUser)
).timeout(12000)

function createUser() {
  const promise = new Promise((resolve, reject) => {
    console.log('Creating user with id %s...', userId)
    request({
      body: {
        id: userId
      },
      json: true,
      method: 'POST',
      url: `${domain}/users/v1`
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        expect(res).to.have.property('statusCode', 201)
        expect(body).to.have.property('id', userId)
        expect(body).to.have.property('token')
        console.log('User %s created. Token is %s.', userId, body.token)
        resolve(body.token)
      }
    })
  })

  return promise
}

function deleteUser(token) {
  const promise = new Promise((resolve, reject) => {
    console.log('Deleting user with id %s...', userId)
    request({
      headers: {
        Authorization: token
      },
      json: true,
      method: 'DELETE',
      url: `${domain}/users/v1/me`
    }, (err, res, body) => {
      if (err) {
        reject(err)
      } else {
        expect(res).to.have.property('statusCode', 204)
        console.log('User %s deleted.', userId)
        resolve(res)
      }
    })
  })

  return promise
}