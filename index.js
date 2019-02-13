#!/usr/bin/env node
const args = require('args')
const main = require('./lib/main')

args
  .option('domain', 'The API host domain to use', 'www.james24apis.com')
  .option(['x', 'ecosystem'], 'Name of the ecosystem to test. The necessary tests are derived from this.', 'james')
  .option('include', 'Microservice versions to (additionally) include in tests.', '{}')
  .example('api-test -d dev.james24apis.com -x james', 'Performs all tests cases required by the production `james` environment, using the base url `https://dev.james24apis.com`.')
  .example(`api-test -d users.staging.james24apis.com -x james -i '{"users":["v1","v2"]}'`, 'Performs all tests cases required by the production `james` environment - including those, which can be performed using the versions `v1` and `v2` of the `users` microservice - using the base url `https://users.staging.james24apis.com`.')

const flags = args.parse(process.argv)

main(flags)
