const path = require('path')

const dependencies = {
  recipes: ['v1'],
  users: ['v1']
}

const file = path.join(__dirname, 'recipes.apispec.js')

module.exports = { dependencies, file }
