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
  mochaAddFile: sinon.spy(),
  mochaRun: sinon.spy()
}
const mocks = {
  mocha: {
    addFile: spies.mochaAddFile,
    run: spies.mochaRun
  },
  usersFullMetaApispec: {
    dependencies: {
      'user-preferences': ['v1'],
      'user-profiles': ['v1'],
      users: ['v1']
    },
    file: path.join(__dirname, 'users-full.apispec.js')
  },
  usersMetaApispec: {
    dependencies: {
      users: ['v1']
    },
    file: path.join(__dirname, 'users.apispec.js')
  }
}

// Specs
describe('calling test', () => {
  before(mockModules)
  beforeEach(resetSpies)
  after(unmockModules)

  const microservices = {
    'user-profiles': ['v1'],
    users: ['v1', 'v2']
  }

  it('adds the correct files to mocha', () => {
    mocks.test('https://www.james24apis.com', microservices)
    expect(spies.mochaAddFile).to.have.been.calledWith(sinon.match(/\/users\.apispec\.js$/))
    expect(spies.mochaAddFile).to.not.have.been.calledWith(sinon.match(/\/users-full\.apispec\.js$/))
  })

  it('runs the tests with mocha', () => {
    mocks.test('https://www.james24apis.com', microservices)
    expect(spies.mochaRun).to.have.been.called
  })
})

// Helper functions
function mockModules() {
  mockery.enable({ useCleanCache: true, warnOnUnregistered: false })
  // Mock console
  var consoleMock = {
    error: () => {},
    log: () => {}
  }
  mockery.registerMock('./common/console', consoleMock)
  // Mock common stuff
  mockery.registerMock('./common/mocha', mocks.mocha)
  // Mock api-specs
  const absPath = path.join(__dirname, 'api-specs')
  mockery.registerMock(path.join(absPath, 'users-full.meta.apispec.js'), mocks.usersFullMetaApispec)
  mockery.registerMock(path.join(absPath, 'users.meta.apispec.js'), mocks.usersMetaApispec)
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
