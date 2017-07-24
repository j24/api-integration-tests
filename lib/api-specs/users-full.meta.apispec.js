const path = require('path')

const dependencies = {
  'user-preferences': ['v1'],
  'user-profiles': ['v1'],
  users: ['v1']
}

const file = path.join(__dirname, 'users-full.apispec.js')

module.exports = { file, dependencies }
