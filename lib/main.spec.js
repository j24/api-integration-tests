/* eslint-disable no-undef */
const chai = require('chai')
const mockery = require('mockery')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

// Initialization instructions
chai.use(sinonChai)


// Global variables and instructions
const expect = chai.expect
const mocks = {}
const spies = {
  request: sinon.spy((options, cb) => {
    const res = {
      statusCode: 200
    }
    const body = {
      users: ['v1']
    }
    cb(null, res, body)
  }),
  test: sinon.spy()
}

// Specs
describe('calling main', () => {
  before(mockModules)
  beforeEach(resetSpies)
  after(unmockModules)

  describe('with an existing ecosystem', () => {
    it('calls test with correct parameters', () => {
      const flags = {
        domain: 'www.james24apis.com',
        ecosystem: 'james',
        include: '{}'
      }
      const microservices = {
        users: ['v1']
      }
      mocks.main(flags)
      .then(() => {
        expect(spies.test).to.have.been.calledWith('https://www.james24apis.com', microservices)
      })
    })

    describe('using include', () => {
      it('calls test with correct parameters', () => {
        const flags = {
          domain: 'www.james24apis.com',
          ecosystem: 'james',
          include: JSON.stringify({
            'user-accounts': ['v1'],
            users: ['v2']
          })
        }
        const microservices = {
            'user-accounts': ['v1'],
            users: ['v1', 'v2']
          }
        mocks.main(flags)
        .then(() => {
          expect(spies.test).to.have.been.calledWith('https://www.james24apis.com', microservices)
        })
      })
    })
  })
})

// Helper functions
function mockModules() {
  mockery.enable({ useCleanCache: true, warnOnUnregistered: false })
  // Mock common stuff
  mockery.registerMock('request', spies.request)
  mockery.registerMock('./test', spies.test)
  // Require test module after mocking
  mocks.main = require('./main')
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
