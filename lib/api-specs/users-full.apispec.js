const chai = require('chai')
const request = require('request')

// Global variables and instructions
const expect = chai.expect

it('creates a user with profile & preferences and destroys it all', () => Promise.resolve()
  .then(createUser)
  .then(deleteUser)
)

function createUser() {
  const promise = new Promise((resolve, reject) => {
    resolve()
  })

  return promise
}

function deleteUser() {
  const promise = new Promise((resolve, reject) => {
    resolve()
  })

  return promise
}