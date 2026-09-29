

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


describe('MoodEntryEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TALLY_TEST_LIVE=TRUE.
  afterEach(liveDelay('TALLY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TallySDK.test()
    const ent = testsdk.MoodEntry()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TALLY_TEST_LIVE
    for (const op of ['create', 'list', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'mood_entry.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"body":{"a":true,"h":"Body","n":"body","op":{"list":{"req":false,"type":"`$STRING`"}},"r":true,"t":"`$STRING`","key$":"body","index$":0},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$INTEGER`","key$":"id","index$":1},"logged_at":{"a":true,"fo":"date-time","h":"Logged At","n":"logged_at","r":false,"sh":"ISO 8601 timestamp.","t":"`$STRING`","key$":"logged_at","index$":2},"time_label":{"a":true,"h":"Time Label","n":"time_label","r":false,"sh":"Human-readable local time","t":"`$STRING`","key$":"time_label","index$":3}},"id":{"field":"id","name":"id"},"name":"mood_entry","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /mood_entries","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/mood_entries","q":{},"r":{},"s":[{"lit":"mood_entries"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /mood_entries","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"2026-06-03","k":"query","n":"date","or":"date","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/mood_entries","q":{"exist":["date"]},"r":{},"s":[{"lit":"mood_entries"}],"t":{"req":"`reqdata`","res":"`body.entries`"},"index$":0}],"key$":"list"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /mood_entries/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"DELETE","o":"/mood_entries/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"mood_entries"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"}},"relations":{"ancestors":[]},"key$":"mood_entry","name__orig":"mood_entry","Name":"MoodEntry","name_":"mood_entry","name-":"mood-entry","NAME":"MOOD_ENTRY","index$":2}, {"active":true,"entity":"mood_entry","key$":"BasicMoodEntryFlow","kind":"basic","name":"BasicMoodEntryFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"mood_entry_ref01"},"m":{},"o":"create","s":[],"v":[]},{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"mood_entry_ref01"}}]},{"a":true,"d":{},"i":{"ref":"mood_entry_ref01","suffix":"_rm0"},"m":{"id":"mood_entry01"},"o":"remove","s":[],"v":[]},{"a":true,"d":{},"i":{"suffix":"_rt0"},"m":{},"o":"list","s":[],"v":[{"apply":"ItemNotExists","def":{"ref":"mood_entry_ref01"}}]}]}, 'MoodEntry', {"POST /mood_entries":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["body"],"properties":{"body":{"type":"string","example":"Feeling really focused today.","key$":"body"},"logged_at":{"type":"string","format":"date-time","description":"ISO 8601 timestamp. Defaults to now.","example":"2026-06-03T09:30:00","key$":"logged_at"}},"index$":1}}}},"parameters":[]},"GET /mood_entries":{"protocol":"http","parameters":[{"name":"date","in":"query","description":"Date to fetch entries for (YYYY-MM-DD). Defaults to today.","required":false,"schema":{"type":"string","format":"date","example":"2026-06-03"},"index$":0}]},"DELETE /mood_entries/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer"},"description":"Resource ID","x-ref":"#/components/parameters/Id","index$":0}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const mood_entry_ref01_ent = client.MoodEntry()
    let mood_entry_ref01_data = setup.data.new.mood_entry['mood_entry_ref01']

    mood_entry_ref01_data = (await mood_entry_ref01_ent.create(mood_entry_ref01_data)).data()
    assert(null != mood_entry_ref01_data.id)


    // LIST
    const mood_entry_ref01_match: any = {}

    const mood_entry_ref01_list = (await mood_entry_ref01_ent.list(mood_entry_ref01_match)).map((e: any) => e.data())

    assert(!isempty(select(mood_entry_ref01_list, { id: mood_entry_ref01_data.id })))


    // REMOVE
    const mood_entry_ref01_match_rm0: any = { id: mood_entry_ref01_data.id }
    await mood_entry_ref01_ent.remove(mood_entry_ref01_match_rm0)
  

    // LIST
    const mood_entry_ref01_match_rt0: any = {}

    const mood_entry_ref01_list_rt0 = (await mood_entry_ref01_ent.list(mood_entry_ref01_match_rt0)).map((e: any) => e.data())

    assert(isempty(select(mood_entry_ref01_list_rt0, { id: mood_entry_ref01_data.id })))


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/mood_entry/MoodEntryTestData.json')

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
    ['mood_entry01','mood_entry02','mood_entry03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'TALLY_TEST_MOOD_ENTRY_ENTID': idmap,
    'TALLY_TEST_LIVE': 'FALSE',
    'TALLY_TEST_EXPLAIN': 'FALSE',
    'TALLY_APIKEY': '',
  })

  idmap = env['TALLY_TEST_MOOD_ENTRY_ENTID']

  const live = 'TRUE' === env.TALLY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TALLY_TEST_MOOD_ENTRY_ENTID']
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
  
