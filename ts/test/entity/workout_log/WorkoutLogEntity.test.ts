

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


describe('WorkoutLogEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TALLY_TEST_LIVE=TRUE.
  afterEach(liveDelay('TALLY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TallySDK.test()
    const ent = testsdk.WorkoutLog()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TALLY_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'workout_log.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"activity_type":{"a":true,"h":"Activity Type","n":"activity_type","r":false,"t":"`$STRING`","key$":"activity_type","index$":0},"calories":{"a":true,"h":"Calories","n":"calories","r":false,"t":"`$INTEGER`","key$":"calories","index$":1},"distance_m":{"a":true,"h":"Distance M","n":"distance_m","r":false,"sh":"Distance in metres","t":"`$INTEGER`","key$":"distance_m","index$":2},"distance_miles":{"a":true,"h":"Distance Miles","n":"distance_miles","r":false,"sh":"Distance in miles (rounded to 1 decimal)","t":"`$NUMBER`","key$":"distance_miles","index$":3},"duration_label":{"a":true,"h":"Duration Label","n":"duration_label","r":false,"sh":"Human-friendly duration, e.g.","t":"`$STRING`","key$":"duration_label","index$":4},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$INTEGER`","key$":"id","index$":5},"logged_on":{"a":true,"fo":"date","h":"Logged On","n":"logged_on","r":false,"t":"`$STRING`","key$":"logged_on","index$":6},"moving_time_s":{"a":true,"h":"Moving Time S","n":"moving_time_s","r":false,"sh":"Moving time in seconds","t":"`$INTEGER`","key$":"moving_time_s","index$":7},"name":{"a":true,"h":"Name","n":"name","r":false,"t":"`$STRING`","key$":"name","index$":8},"occurred_at":{"a":true,"fo":"date-time","h":"Occurred At","n":"occurred_at","r":false,"t":"`$STRING`","key$":"occurred_at","index$":9},"source":{"a":true,"h":"Source","n":"source","r":false,"t":"`$STRING`","key$":"source","index$":10}},"id":{"field":"id","name":"id"},"name":"workout_log","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /workout_logs","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"2026-06-03","k":"query","n":"date","or":"date","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/workout_logs","q":{"exist":["date"]},"r":{},"s":[{"lit":"workout_logs"}],"t":{"req":"`reqdata`","res":"`body.workouts`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"workout_log","name__orig":"workout_log","Name":"WorkoutLog","name_":"workout_log","name-":"workout-log","NAME":"WORKOUT_LOG","index$":4}, {"active":true,"entity":"workout_log","key$":"BasicWorkoutLogFlow","kind":"basic","name":"BasicWorkoutLogFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"workout_log_ref01"}}]}]}, 'WorkoutLog', {"GET /workout_logs":{"protocol":"http","parameters":[{"name":"date","in":"query","description":"Date to fetch workouts for (YYYY-MM-DD). Defaults to today in the user's timezone.","required":false,"schema":{"type":"string","format":"date","example":"2026-06-03"},"index$":0}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let workout_log_ref01_data = Object.values(setup.data.existing.workout_log)[0] as any

    // LIST
    const workout_log_ref01_ent = client.WorkoutLog()
    const workout_log_ref01_match: any = {}

    const workout_log_ref01_list = (await workout_log_ref01_ent.list(workout_log_ref01_match)).map((e: any) => e.data())


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/workout_log/WorkoutLogTestData.json')

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
    ['workout_log01','workout_log02','workout_log03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'TALLY_TEST_WORKOUT_LOG_ENTID': idmap,
    'TALLY_TEST_LIVE': 'FALSE',
    'TALLY_TEST_EXPLAIN': 'FALSE',
    'TALLY_APIKEY': '',
  })

  idmap = env['TALLY_TEST_WORKOUT_LOG_ENTID']

  const live = 'TRUE' === env.TALLY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TALLY_TEST_WORKOUT_LOG_ENTID']
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
  
