/* eslint-disable no-undef */
const chai = require('chai')
const mockery = require('mockery')
const sinonChai = require('sinon-chai')

// Initialization instructions
chai.use(sinonChai)


// Global variables and instructions
const expect = chai.expect
const mocks = {}
const spies = {}

// Specs
describe('calling isSubset', () => {
  before(mockModules)
  beforeEach(resetSpies)
  after(unmockModules)

  describe('with matching types', () => {
    describe('with simple arrays', () => {
      describe('a being a subset of b', () => {
        const a = [
          'kirk',
          'zulu'
        ]
        const b = [
          'kirk',
          'spock',
          'zulu'
        ]

        it('returns true', () => {
          expect(mocks.isSubset(a, b)).to.be.true
        })
      })

      describe('a not being a subset of b', () => {
        const a = [
          'kirk',
          'uhura',
          'zulu'
        ]
        const b = [
          'kirk',
          'spock',
          'zulu'
        ]

        it('returns false', () => {
          expect(mocks.isSubset(a, b)).to.be.false
        })
      })
    })

    describe('with simple objects', () => {
      describe('a being a subset of b', () => {
        const a = {
          kirk: 'captain'
        }
        const b = {
          kirk: 'captain',
          spock: 'commander'
        }

        it('returns true', () => {
          expect(mocks.isSubset(a, b)).to.be.true
        })
      })

      describe('a not being a subset of b', () => {
        const a = {
          kirk: 'captain',
          zulu: 'lieutenant'
        }
        const b = {
          kirk: 'captain',
          spock: 'commander'
        }

        it('returns false', () => {
          expect(mocks.isSubset(a, b)).to.be.false
        })
      })
    })

    describe('with strings', () => {
      describe('a being equal to b', () => {
        const a = 'kirk'
        const b = 'kirk'

        it('returns true', () => {
          expect(mocks.isSubset(a, b)).to.be.true
        })
      })

      describe('a not being equal to b', () => {
        const a = 'kirk'
        const b = 'spock'

        it('returns false', () => {
          expect(mocks.isSubset(a, b)).to.be.false
        })
      })
    })

    describe('with numbers', () => {
      describe('a being equal to b', () => {
        const a = 42
        const b = 42

        it('returns true', () => {
          expect(mocks.isSubset(a, b)).to.be.true
        })
      })

      describe('a not being equal to b', () => {
        const a = 42
        const b = 314

        it('returns false', () => {
          expect(mocks.isSubset(a, b)).to.be.false
        })
      })
    })

    describe('with complex objects', () => {
      describe('a being a subset of b', () => {
        const a = {
          crew: {
            kirk: 'captain',
            spock: 'commander'
          },
          ship: 'enterprise'
        }
        const b = {
          crew: {
            kirk: 'captain',
            spock: 'commander',
            zulu: 'lieutenant'
          },
          ship: 'enterprise'
        }

        it('returns true', () => {
          expect(mocks.isSubset(a, b)).to.be.true
        })
      })

      describe('a not being a subset of b', () => {
        const a = {
          crew: {
            kirk: 'captain',
            spock: 'commander',
            uhura: 'lieutenant'
          },
          ship: 'enterprise'
        }
        const b = {
          crew: {
            kirk: 'captain',
            spock: 'commander',
            zulu: 'lieutenant'
          },
          ship: 'enterprise'
        }

        it('returns false', () => {
          expect(mocks.isSubset(a, b)).to.be.false
        })
      })
    })
  })
})

// Helper functions
function mockModules() {
  mockery.enable({ useCleanCache: true, warnOnUnregistered: false })
  // Require test module after mocking
  mocks.isSubset = require('./is-subset')
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
