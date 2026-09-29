

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


describe('FoodEntryEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TALLY_TEST_LIVE=TRUE.
  afterEach(liveDelay('TALLY_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TallySDK.test()
    const ent = testsdk.FoodEntry()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TALLY_TEST_LIVE
    for (const op of ['create', 'list', 'update', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'food_entry.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"caffeine_mg":{"a":true,"h":"Caffeine Mg","n":"caffeine_mg","r":false,"t":"`$INTEGER`","key$":"caffeine_mg","index$":0},"calories":{"a":true,"h":"Calories","n":"calories","r":false,"t":"`$INTEGER`","key$":"calories","index$":1},"carbs_g":{"a":true,"h":"Carbs G","n":"carbs_g","r":false,"t":"`$NUMBER`","key$":"carbs_g","index$":2},"confirmed":{"a":true,"h":"Confirmed","n":"confirmed","r":false,"t":"`$BOOLEAN`","key$":"confirmed","index$":3},"date":{"a":true,"fo":"date","h":"Date","n":"date","r":false,"sh":"Date to log against (YYYY-MM-DD).","t":"`$STRING`","key$":"date","index$":4},"entry":{"a":true,"h":"Entry","n":"entry","r":false,"t":"`$OBJECT`","key$":"entry","index$":5},"fat_g":{"a":true,"h":"Fat G","n":"fat_g","r":false,"t":"`$NUMBER`","key$":"fat_g","index$":6},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$INTEGER`","key$":"id","index$":7},"input":{"a":true,"h":"Input","n":"input","r":true,"sh":"Natural-language food description, e.g.","t":"`$STRING`","key$":"input","index$":8},"logged_on":{"a":true,"fo":"date","h":"Logged On","n":"logged_on","r":false,"t":"`$STRING`","key$":"logged_on","index$":9},"meal_type":{"a":true,"h":"Meal Type","n":"meal_type","r":false,"t":"`$STRING`","key$":"meal_type","index$":10},"name":{"a":true,"h":"Name","n":"name","r":false,"t":"`$STRING`","key$":"name","index$":11},"protein_g":{"a":true,"h":"Protein G","n":"protein_g","r":false,"t":"`$NUMBER`","key$":"protein_g","index$":12}},"id":{"field":"id","name":"id"},"name":"food_entry","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /food_entries","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/food_entries","q":{},"r":{},"s":[{"lit":"food_entries"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"POST /food_entries/parse","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/food_entries/parse","q":{"$action":"parse"},"r":{},"s":[{"lit":"food_entries"},{"lit":"parse"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /food_entries","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"2026-06-03","k":"query","n":"date","or":"date","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/food_entries","q":{"exist":["date"]},"r":{},"s":[{"lit":"food_entries"}],"t":{"req":"`reqdata`","res":"`body.entries`"},"index$":0}],"key$":"list"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /food_entries/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"DELETE","o":"/food_entries/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"food_entries"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"},"update":{"input":"data","name":"update","points":[{"a":true,"co":{"id":"PATCH /food_entries/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"PATCH","o":"/food_entries/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"food_entries"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"food_entry","name__orig":"food_entry","Name":"FoodEntry","name_":"food_entry","name-":"food-entry","NAME":"FOOD_ENTRY","index$":1}, {"active":true,"entity":"food_entry","key$":"BasicFoodEntryFlow","kind":"basic","name":"BasicFoodEntryFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"food_entry_ref01"},"m":{},"o":"create","s":[],"v":[]},{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"food_entry_ref01"}}]},{"a":true,"d":{},"i":{"ref":"food_entry_ref01","srcdatavar":"food_entry_ref01_data","suffix":"_up0","textfield":"date"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-food_entry_ref01"}}],"v":[]},{"a":true,"d":{},"i":{"ref":"food_entry_ref01","suffix":"_rm0"},"m":{"id":"food_entry01"},"o":"remove","s":[],"v":[]},{"a":true,"d":{},"i":{"suffix":"_rt0"},"m":{},"o":"list","s":[],"v":[{"apply":"ItemNotExists","def":{"ref":"food_entry_ref01"}}]}]}, 'FoodEntry', {"POST /food_entries":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["input"],"properties":{"input":{"type":"string","description":"Natural-language food description, e.g. \"chicken and rice\"","example":"grilled chicken breast with brown rice and broccoli","key$":"input"},"meal_type":{"type":"string","enum":["breakfast","lunch","dinner","snack"],"example":"lunch","x-ref":"#/components/schemas/MealType","key$":"meal_type"},"date":{"type":"string","format":"date","description":"Date to log against (YYYY-MM-DD). Defaults to today.","example":"2026-06-03","key$":"date"}},"x-ref":"#/components/schemas/FoodEntryCreateBody","index$":1}}}},"parameters":[]},"POST /food_entries/parse":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["input"],"properties":{"input":{"type":"string","example":"2 scrambled eggs and a slice of toast"},"meal_type":{"type":"string","enum":["breakfast","lunch","dinner","snack"],"example":"lunch","x-ref":"#/components/schemas/MealType"}}}}}},"parameters":[]},"GET /food_entries":{"protocol":"http","parameters":[{"name":"date","in":"query","description":"Date to fetch entries for (YYYY-MM-DD). Defaults to today in the user's timezone.","required":false,"schema":{"type":"string","format":"date","example":"2026-06-03"},"index$":0}]},"DELETE /food_entries/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer"},"description":"Resource ID","x-ref":"#/components/parameters/Id","index$":0}]},"PATCH /food_entries/{id}":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"entry":{"type":"object","properties":{"name":{"type":"string"},"calories":{"type":"integer"},"protein_g":{"type":"number"},"carbs_g":{"type":"number"},"fat_g":{"type":"number"},"caffeine_mg":{"type":"integer"},"meal_type":{"type":"string","enum":["breakfast","lunch","dinner","snack"],"example":"lunch","x-ref":"#/components/schemas/MealType"}},"key$":"entry"}},"index$":1}}}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer"},"description":"Resource ID","x-ref":"#/components/parameters/Id","index$":0}]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const food_entry_ref01_ent = client.FoodEntry()
    let food_entry_ref01_data = setup.data.new.food_entry['food_entry_ref01']

    food_entry_ref01_data = (await food_entry_ref01_ent.create(food_entry_ref01_data)).data()
    assert(null != food_entry_ref01_data.id)


    // LIST
    const food_entry_ref01_match: any = {}

    const food_entry_ref01_list = (await food_entry_ref01_ent.list(food_entry_ref01_match)).map((e: any) => e.data())

    assert(!isempty(select(food_entry_ref01_list, { id: food_entry_ref01_data.id })))


    // UPDATE
    const food_entry_ref01_data_up0: any = {}
    food_entry_ref01_data_up0.id = food_entry_ref01_data.id

    const food_entry_ref01_markdef_up0 = { name: 'date', value: 'Mark01-food_entry_ref01_' + setup.now }
    ;(food_entry_ref01_data_up0 as any)[food_entry_ref01_markdef_up0.name] = food_entry_ref01_markdef_up0.value

    const food_entry_ref01_resdata_up0 = (await food_entry_ref01_ent.update(food_entry_ref01_data_up0)).data()
    assert(food_entry_ref01_resdata_up0.id === food_entry_ref01_data_up0.id)

    assert((food_entry_ref01_resdata_up0 as any)[food_entry_ref01_markdef_up0.name] === food_entry_ref01_markdef_up0.value)


    // REMOVE
    const food_entry_ref01_match_rm0: any = { id: food_entry_ref01_data.id }
    await food_entry_ref01_ent.remove(food_entry_ref01_match_rm0)
  

    // LIST
    const food_entry_ref01_match_rt0: any = {}

    const food_entry_ref01_list_rt0 = (await food_entry_ref01_ent.list(food_entry_ref01_match_rt0)).map((e: any) => e.data())

    assert(isempty(select(food_entry_ref01_list_rt0, { id: food_entry_ref01_data.id })))


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/food_entry/FoodEntryTestData.json')

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
    ['food_entry01','food_entry02','food_entry03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'TALLY_TEST_FOOD_ENTRY_ENTID': idmap,
    'TALLY_TEST_LIVE': 'FALSE',
    'TALLY_TEST_EXPLAIN': 'FALSE',
    'TALLY_APIKEY': '',
  })

  idmap = env['TALLY_TEST_FOOD_ENTRY_ENTID']

  const live = 'TRUE' === env.TALLY_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TALLY_TEST_FOOD_ENTRY_ENTID']
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
  
