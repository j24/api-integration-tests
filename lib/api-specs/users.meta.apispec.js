const path = require('path')

const file = path.join(__dirname, 'users.apispec.js')

const dependencies = {
  users: ['v1']
}

module.exports = { file, dependencies }
