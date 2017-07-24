/* eslint-disable no-undef */
const chai = require('chai')
const mockery = require('mockery')
const path = require('path')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

// Initialization instructions
chai.use(sinonChai)

// Global variables and instructions
const expect = chai.expect
const spies = {
  callbackUsers: sinon.spy(),
  callbackUsersFull: sinon.spy()
}
const mocks = {
  usersApispec: {
    callback: spies.callbackUsers,
    dependencies: {
      users: ['v1']
    }
  },
  usersFullApispec: {
    callback: spies.callbackUsersFull,
    dependencies: {
      'user-preferences': ['v1'],
      'user-profiles': ['v1'],
      users: ['v1']
    }
  }
}

// Specs
describe('calling test', () => {
  before(mockModules)
  beforeEach(resetSpies)
  after(unmockModules)

  it('runs the correct tests', () => {
    const microservices = {
      'user-profiles': ['v1'],
      users: ['v1', 'v2']
    }
    mocks.test('www.james24apis.com', microservices)
    expect(spies.callbackUsers).to.have.been.calledWith('www.james24apis.com')
    expect(spies.callbackUsersFull).to.not.have.been.called
  })
})

// Helper functions
function mockModules() {
  mockery.enable({ useCleanCache: true, warnOnUnregistered: false })
  // Mock api-specs
  const absPath = path.join(__dirname, 'api-specs')
  mockery.registerMock(path.join(absPath, 'users-full.apispec.js'), mocks.usersFullApispec)
  mockery.registerMock(path.join(absPath, 'users.apispec.js'), mocks.usersApispec)
  // Require test module after mocking
  mocks.test = require('./test')
}

function resetSpies() {
  for(const i in spies) {
    spies[i].reset()
  }
}

function unmockModules() {
  mockery.deregisterAll()
  mockery.disable()
}
