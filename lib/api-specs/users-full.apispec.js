const dependencies = {
  'user-preferences': ['v1'],
  'user-profiles': ['v1'],
  users: ['v1']
}

function callback(domain) {
  console.log('Running users-full with domain %s.', domain)
}

module.exports = { callback, dependencies }
