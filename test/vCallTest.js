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

describe('v-call', () => {
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

    await actor.close()

    await server.close()
  })
})

/* global describe, before, after, it */
