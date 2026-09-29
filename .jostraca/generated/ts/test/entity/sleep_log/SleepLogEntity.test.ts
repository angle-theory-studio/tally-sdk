

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


describe('SleepLogEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TALLY_TEST_LIVE=TRUE.
  afterEach(liveDelay('TALLY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TallySDK.test()
    const ent = testsdk.SleepLog()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TALLY_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'sleep_log.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"awake_seconds":{"a":true,"h":"Awake Seconds","n":"awake_seconds","r":false,"t":"`$INTEGER`","key$":"awake_seconds","index$":0},"date":{"a":true,"fo":"date","h":"Date","n":"date","r":false,"t":"`$STRING`","key$":"date","index$":1},"deep_sleep_seconds":{"a":true,"h":"Deep Sleep Seconds","n":"deep_sleep_seconds","r":false,"t":"`$INTEGER`","key$":"deep_sleep_seconds","index$":2},"duration_label":{"a":true,"h":"Duration Label","n":"duration_label","r":false,"sh":"Human-friendly duration, e.g.","t":"`$STRING`","key$":"duration_label","index$":3},"ended_at":{"a":true,"fo":"date-time","h":"Ended At","n":"ended_at","r":false,"t":"`$STRING`","key$":"ended_at","index$":4},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$INTEGER`","key$":"id","index$":5},"light_sleep_seconds":{"a":true,"h":"Light Sleep Seconds","n":"light_sleep_seconds","r":false,"t":"`$INTEGER`","key$":"light_sleep_seconds","index$":6},"rem_sleep_seconds":{"a":true,"h":"Rem Sleep Seconds","n":"rem_sleep_seconds","r":false,"t":"`$INTEGER`","key$":"rem_sleep_seconds","index$":7},"sleep_score":{"a":true,"h":"Sleep Score","n":"sleep_score","r":false,"t":"`$INTEGER`","key$":"sleep_score","index$":8},"source":{"a":true,"h":"Source","n":"source","r":false,"t":"`$STRING`","key$":"source","index$":9},"started_at":{"a":true,"fo":"date-time","h":"Started At","n":"started_at","r":false,"t":"`$STRING`","key$":"started_at","index$":10},"total_sleep_seconds":{"a":true,"h":"Total Sleep Seconds","n":"total_sleep_seconds","r":false,"t":"`$INTEGER`","key$":"total_sleep_seconds","index$":11}},"id":{"field":"id","name":"id"},"name":"sleep_log","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /sleep_logs","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"2026-06-03","k":"query","n":"date","or":"date","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/sleep_logs","q":{"exist":["date"]},"r":{},"s":[{"lit":"sleep_logs"}],"t":{"req":"`reqdata`","res":"`body.sleep_logs`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"sleep_log","name__orig":"sleep_log","Name":"SleepLog","name_":"sleep_log","name-":"sleep-log","NAME":"SLEEP_LOG","index$":3}, {"active":true,"entity":"sleep_log","key$":"BasicSleepLogFlow","kind":"basic","name":"BasicSleepLogFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"sleep_log_ref01"}}]}]}, 'SleepLog', {"GET /sleep_logs":{"protocol":"http","parameters":[{"name":"date","in":"query","description":"Date to fetch sleep for (YYYY-MM-DD). Defaults to today in the user's timezone.","required":false,"schema":{"type":"string","format":"date","example":"2026-06-03"},"index$":0}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let sleep_log_ref01_data = Object.values(setup.data.existing.sleep_log)[0] as any

    // LIST
    const sleep_log_ref01_ent = client.SleepLog()
    const sleep_log_ref01_match: any = {}

    const sleep_log_ref01_list = (await sleep_log_ref01_ent.list(sleep_log_ref01_match)).map((e: any) => e.data())


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/sleep_log/SleepLogTestData.json')

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
    ['sleep_log01','sleep_log02','sleep_log03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'TALLY_TEST_SLEEP_LOG_ENTID': idmap,
    'TALLY_TEST_LIVE': 'FALSE',
    'TALLY_TEST_EXPLAIN': 'FALSE',
    'TALLY_APIKEY': '',
  })

  idmap = env['TALLY_TEST_SLEEP_LOG_ENTID']

  const live = 'TRUE' === env.TALLY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TALLY_TEST_SLEEP_LOG_ENTID']
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
  
