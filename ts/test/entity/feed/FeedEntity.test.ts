

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { TallySDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('FeedEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TALLY_TEST_LIVE=TRUE.
  afterEach(liveDelay('TALLY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TallySDK.test()
    const ent = testsdk.Feed()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TALLY_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'feed.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"date":{"a":true,"fo":"date","h":"Date","n":"date","r":false,"t":"`$STRING`","key$":"date","index$":0},"items":{"a":true,"h":"Items","n":"items","r":false,"t":"`$ARRAY`","key$":"items","index$":1},"relative_label":{"a":true,"h":"Relative Label","n":"relative_label","r":false,"sh":"\"Today\", \"Yesterday\", or the weekday name","t":"`$STRING`","key$":"relative_label","index$":2}},"name":"feed","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /feed","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"2026-06-03","k":"query","n":"before","or":"before","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/feed","q":{"exist":["before"]},"r":{},"s":[{"lit":"feed"}],"t":{"req":"`reqdata`","res":"`body.days`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"feed","name__orig":"feed","Name":"Feed","name_":"feed","name-":"feed","NAME":"FEED","index$":0}, {"active":true,"entity":"feed","key$":"BasicFeedFlow","kind":"basic","name":"BasicFeedFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"feed_ref01"}}]}]}, 'Feed', {"GET /feed":{"protocol":"http","parameters":[{"name":"before","in":"query","description":"Fetch the 14 days ending on (and including) this date. Defaults to today.","required":false,"schema":{"type":"string","format":"date","example":"2026-06-03"},"index$":0}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let feed_ref01_data = Object.values(setup.data.existing.feed)[0] as any

    // LIST
    const feed_ref01_ent = client.Feed()
    const feed_ref01_match: any = {}

    const feed_ref01_list = (await feed_ref01_ent.list(feed_ref01_match)).map((e: any) => e.data())


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/feed/FeedTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = TallySDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['feed01','feed02','feed03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'TALLY_TEST_FEED_ENTID': idmap,
    'TALLY_TEST_LIVE': 'FALSE',
    'TALLY_TEST_EXPLAIN': 'FALSE',
    'TALLY_APIKEY': '',
  })

  idmap = env['TALLY_TEST_FEED_ENTID']

  const live = 'TRUE' === env.TALLY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TALLY_TEST_FEED_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new TallySDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.TALLY_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.TALLY_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
