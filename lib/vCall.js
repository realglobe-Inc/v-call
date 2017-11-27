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
const {EOL} = require('os')

/** @lends vCall */
async function vCall (subject, verb, object, options) {
  const args = argx(arguments)
  subject = String(args.shift()).trim()
  verb = String(args.shift()).trim()
  options = args.pop('object') || {}
  object = args.remain().map(String).map((s) => s.trim())

  const {
    protocol = 'http',
    hostname = 'localhost',
    port,
    connector,
    verbose = false
  } = options

  const log = (msg) => verbose && process.stderr.write(EOL + '[v-call]' + msg + EOL)

  const client = clientFor(connector || 'ws')

  const url = formatUrl({protocol, hostname, port})

  try {
    await client.connect(url)
    const instance = await client.use(subject)
    log(`Calling: "${subject}.${verb}"`)
    const result = await instance[verb](...object)
    process.stdout.write(result)
    return result
  } catch (e) {
    process.stderr.write(String(e.message || e))
    throw e
  } finally {
    await client.disconnect()
  }
}

module.exports = vCall
