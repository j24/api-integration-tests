const path = require('path')

const dependencies = {
  'recipe-groups': ['v1'],
  recipes: ['v1'],
  users: ['v1']
}

const file = path.join(__dirname, 'recipe-groups.apispec.js')

module.exports = { dependencies, file }
