/**
 * Test for vCall.
 * Runs with mocha.
 */
'use strict'

const vCall = require('../lib/vCall')
const vSpotWS = require('v-spot-ws/lib/create')
const asleep = require('asleep')
const aport = require('aport')

const {ok, equal} = require('assert')

describe('v-call', function () {
  this.timeout(80000)
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const port = await aport()
    const server = vSpotWS()
    const actor = vSpotWS.client()

    await server.listen(port)

    actor.load(class YoPerson {
      greet (msg) {
        return `yo, ${msg}`
      }
    }, 'jp.realglobe.vcall.test.yo')

    actor.connect(`http://localhost:${port}`)

    equal(
      await vCall('jp.realglobe.vcall.test.yo', 'greet', 'foo', {
        port
      }),
      'yo, foo'
    )

    await asleep(100)

    await actor.disconnect()

    await server.close()
  })

  it('Use v.realglobe.work', async () => {
    const client = vSpotWS.client()

    client.load({
      sayHi (...msg) {
        return ['Hi', ...msg].join(', ')
      }
    }, 'jp.realglobe.v-call.test.example01')

    await client.connect(`https://v.realglobe.work`)

    equal(
      (await vCall('jp.realglobe.v-call.test.example01', 'sayHi', 'From Test', 'yes', {
        protocol: 'https', hostname: 'v.realglobe.work'
      })).trim(),
      'Hi, From Test, yes',
    )

    await client.disconnect()
  })
})

/* global describe, before, after, it */
