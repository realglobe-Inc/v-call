/**
 * @class vCall
 * @param {string} subject - Subject id
 * @param {string} verb - Verb to invoke
 * @param {...string} object - Method arguments
 * @param {Object} options
 * @returns {Promise}
 */
'use strict'

const argx = require('argx')
const clientFor = require('./clientFor')
const {format: formatUrl} = require('url')

/** @lends vCall */
async function vCall (subject, verb, object, options) {
  const args = argx(arguments)
  subject = args.shift()
  verb = args.shift()
  options = args.pop('object') || {}
  object = args.remain()

  const {
    protocol = 'http',
    hostname = 'localhost',
    port,
    connector
  } = options

  const client = clientFor(connector || 'ws')

  const url = formatUrl({protocol, hostname, port})
  await client.connect(url)

  try {
    const instance = await client.use(subject)
    const result = await instance[verb](...object)
    process.stdout.write(result)
    return result
  } finally {
    await client.close()
  }
}

module.exports = vCall
