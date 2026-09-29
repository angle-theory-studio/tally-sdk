// Handwritten API-contract regression check. No network requests or real tokens.
// Run from the repository root after building ts/: node --test checks/api-contract.test.cjs
const test = require('node:test')
const assert = require('node:assert/strict')
const { TallySDK } = require('../ts/dist/TallySDK.js')

const DATE = '2026-09-29'
const TOKEN = 'offline-test-placeholder'
const BASE = 'https://www.logwithtally.com/api/v1'

// Independent fixtures transcribed from .sdk/def/openapi.yaml. They deliberately
// contain zero, false, negative remaining values, nulls, multiple records, and
// unknown response properties so that lossy response transformations fail.
const food = {
  id: 11, name: 'Scrambled eggs (2)', meal_type: 'breakfast', logged_on: DATE,
  calories: 180, protein_g: 12.5, carbs_g: 2, fat_g: 13, caffeine_mg: 0,
  confirmed: false,
}
const secondFood = { id: 12, name: 'Toast', calories: 90, confirmed: true }
const totals = {
  calories: 270, protein_g: 15.5, carbs_g: 20, fat_g: 14, caffeine_mg: 0,
  entry_count: 2,
}
const remaining = { calories: -70, protein_g: 0, carbs_g: -0.5, fat_g: 1.25 }
const mood = {
  id: 31, body: 'Feeling focused — чудово!',
  logged_at: '2026-09-29T09:30:00.000Z', time_label: '12:30 PM',
}
const workout = {
  id: 41, name: 'Morning Run', activity_type: 'Run', source: 'strava',
  calories: null, distance_m: 0, distance_miles: 0, moving_time_s: null,
  duration_label: null, occurred_at: '2026-09-29T07:00:00Z', logged_on: DATE,
}
const sleep = {
  id: 51, date: DATE, source: 'withings', started_at: null, ended_at: null,
  total_sleep_seconds: 25200, deep_sleep_seconds: null,
  light_sleep_seconds: 15000, rem_sleep_seconds: 4800, awake_seconds: 0,
  sleep_score: null, duration_label: '7h 0m',
}
const feed = {
  days: [{
    date: DATE, relative_label: 'Today', items: [
      { type: 'workout', id: 41, time_label: '12:30 PM', distance_m: null, moving_time_s: null, source: null },
      { type: 'weight', id: 61, time_label: '11:00 AM', weight_lbs: 174.2 },
      { type: 'mood', id: 31, time_label: '10:00 AM', body: mood.body },
      { type: 'food', id: 11, time_label: '9:00 AM', name: food.name, meal_type: 'breakfast', calories: 180 },
    ],
  }, {
    date: '2026-09-27', relative_label: 'Sunday', items: [],
  }],
  older_before: '2026-09-15',
}

// This table contains all 11 documented HTTP operations, including the separate
// non-persisting parse route. Expected wire requests are fixed here, not derived
// from the SDK model or implementation under test.
const OPERATIONS = [
  {
    name: 'listFoodEntries', args: [{ date: DATE }], method: 'GET',
    path: '/food_entries?date=' + DATE, status: 200,
    response: { date: DATE, entries: [food, secondFood], totals, remaining, goals: null },
  },
  {
    name: 'createFoodEntries',
    args: [{ input: '2 scrambled eggs and toast', meal_type: 'breakfast', date: DATE }],
    method: 'POST', path: '/food_entries', status: 201,
    body: { input: '2 scrambled eggs and toast', meal_type: 'breakfast', date: DATE },
    response: { entries: [food, secondFood], totals, remaining },
  },
  {
    name: 'parseFoodEntries', args: [{ input: '2 scrambled eggs', meal_type: 'breakfast' }],
    method: 'POST', path: '/food_entries/parse', status: 200,
    body: { input: '2 scrambled eggs', meal_type: 'breakfast' },
    response: { raw_input: '2 scrambled eggs', meal_type: 'breakfast', parsed: [{
      name: 'Scrambled eggs (2)', calories: 180, protein_g: 12.5, carbs_g: 2,
      fat_g: 13, caffeine_mg: 0,
    }] },
  },
  {
    name: 'updateFoodEntry', args: [11, { entry: { name: 'Eggs & toast', calories: 0, protein_g: 0.5, meal_type: 'snack' } }],
    method: 'PATCH', path: '/food_entries/11', status: 200,
    body: { entry: { name: 'Eggs & toast', calories: 0, protein_g: 0.5, meal_type: 'snack' } },
    response: { ...food, name: 'Eggs & toast', calories: 0, protein_g: 0.5, meal_type: 'snack' },
  },
  {
    name: 'deleteFoodEntry', args: [11], method: 'DELETE', path: '/food_entries/11', status: 200,
    response: { message: 'Entry removed', totals, remaining },
  },
  {
    name: 'listMoodEntries', args: [{ date: DATE }], method: 'GET',
    path: '/mood_entries?date=' + DATE, status: 200, response: { entries: [mood] },
  },
  {
    name: 'createMoodEntry', args: [{ body: mood.body, logged_at: mood.logged_at }],
    method: 'POST', path: '/mood_entries', status: 201,
    body: { body: mood.body, logged_at: mood.logged_at }, response: mood,
  },
  {
    name: 'deleteMoodEntry', args: [31], method: 'DELETE', path: '/mood_entries/31',
    status: 200, response: { message: 'Entry removed' },
  },
  {
    name: 'listWorkoutLogs', args: [{ date: DATE }], method: 'GET',
    path: '/workout_logs?date=' + DATE, status: 200, response: { date: DATE, workouts: [workout] },
  },
  {
    name: 'listSleepLogs', args: [{ date: DATE }], method: 'GET',
    path: '/sleep_logs?date=' + DATE, status: 200,
    response: { date: DATE, sleep_logs: [sleep, { id: 52, total_sleep_seconds: 1200, source: 'manual' }] },
  },
  {
    name: 'getFeed', args: [{ before: DATE }], method: 'GET', path: '/feed?before=' + DATE,
    status: 200, response: feed,
  },
]

function makeClient(responses, options = {}) {
  const calls = []
  const queue = [...responses]
  const client = new TallySDK({
    apikey: TOKEN,
    ...options,
    system: {
      fetch: async (url, init) => {
        calls.push({ url, init })
        assert.ok(queue.length > 0, 'unexpected extra HTTP request')
        const next = queue.shift()
        if (next instanceof Error) throw next
        return new Response(next.raw ?? JSON.stringify(next.body), {
          status: next.status ?? 200,
          headers: { 'content-type': next.contentType ?? 'application/json' },
        })
      },
    },
  })
  return { client, calls }
}

function assertWire(call, operation) {
  assert.equal(String(call.url), BASE + operation.path)
  assert.equal(call.init.method, operation.method)
  const headers = new Headers(call.init.headers)
  assert.equal(headers.get('authorization'), 'Bearer ' + TOKEN)
  if (operation.body === undefined) {
    assert.equal(call.init.body, undefined, 'GET and DELETE must not send a body')
  } else {
    assert.match(headers.get('content-type') ?? '', /^application\/json(?:\s*;|$)/i)
    assert.deepEqual(JSON.parse(call.init.body), operation.body)
  }
}

for (const operation of OPERATIONS) {
  test(`api.${operation.name}: exact request and complete documented response`, async () => {
    const body = { ...operation.response, future_field: { retained: true } }
    const { client, calls } = makeClient([{ status: operation.status, body }])
    const args = structuredClone(operation.args)
    const result = await client.api[operation.name](...args)
    assert.equal(calls.length, 1)
    assertWire(calls[0], operation)
    assert.deepEqual(result, body, 'all envelope fields and unknown response fields must survive')
    assert.deepEqual(args, operation.args, 'request arguments must not be mutated')
  })
}

test('the companion API uses the configured SDK base URL', async () => {
  const { client, calls } = makeClient([{ body: { days: [] } }], { base: 'https://offline.example.test/v1' })
  await client.api.getFeed({ before: DATE })
  assert.equal(String(calls[0].url), 'https://offline.example.test/v1/feed?before=' + DATE)
})

test('the companion API respects the direct-operation permission gate', async () => {
  const { client, calls } = makeClient([], { allow: { op: 'list' } })
  await assert.rejects(() => client.api.getFeed(), err => {
    assert.equal(err.code, 'transport')
    assert.equal(err.operation, 'getFeed')
    assert.equal(err.status, undefined)
    return true
  })
  assert.equal(calls.length, 0, 'disallowed direct operations must not reach fetch')
})

test('a GET-only SDK permits all five companion read operations', async () => {
  for (const operation of OPERATIONS.filter(op => op.method === 'GET')) {
    const { client, calls } = makeClient([
      { status: operation.status, body: operation.response },
    ], { allow: { method: 'GET' } })
    assert.deepEqual(await client.api[operation.name](...structuredClone(operation.args)), operation.response, operation.name)
    assert.equal(calls.length, 1, operation.name + ' read must remain permitted')
    assertWire(calls[0], operation)
  }
})

for (const operation of OPERATIONS.filter(op => op.method !== 'GET')) {
  test(`a GET-only SDK blocks api.${operation.name} before fetch`, async () => {
    const { client, calls } = makeClient([
      { status: operation.status, body: operation.response },
    ], { allow: { method: 'GET' } })
    await assert.rejects(() => client.api[operation.name](...structuredClone(operation.args)), err => {
      assert.equal(err.code, 'transport')
      assert.equal(err.operation, operation.name)
      assert.equal(err.status, undefined)
      return true
    }, 'a forbidden HTTP method must reject')
    assert.equal(calls.length, 0, 'a forbidden HTTP method must not reach fetch')
  })
}

test('all operation response properties remain optional as specified upstream', async () => {
  for (const operation of OPERATIONS) {
    const { client, calls } = makeClient([{ status: operation.status, body: {} }])
    const result = await client.api[operation.name](...structuredClone(operation.args))
    assert.deepEqual(result, {}, operation.name)
    assert.equal(calls.length, 1, operation.name)
  }
})

test('all five list endpoints omit optional query fields without inventing local dates', async () => {
  for (const name of ['listFoodEntries', 'listMoodEntries', 'listWorkoutLogs', 'listSleepLogs', 'getFeed']) {
    const operation = OPERATIONS.find(op => op.name === name)
    const { client, calls } = makeClient([{ body: {} }])
    await client.api[name]()
    assertWire(calls[0], { ...operation, path: operation.path.split('?')[0] })
  }
})

test('feed pagination preserves the cursor across a sparse empty page', async () => {
  const pages = [
    feed,
    { days: [], older_before: '2026-09-01' },
    { days: [{ date: '2026-08-31', items: [{ type: 'weight', id: 70, time_label: '8 AM', weight_lbs: 172 }] }] },
  ]
  const { client, calls } = makeClient(pages.map(body => ({ body })))
  const first = await client.api.getFeed()
  const second = await client.api.getFeed({ before: first.older_before })
  const third = await client.api.getFeed({ before: second.older_before })
  assert.deepEqual([first, second, third], pages)
  assert.deepEqual(calls.map(call => String(call.url)), [
    BASE + '/feed', BASE + '/feed?before=2026-09-15', BASE + '/feed?before=2026-09-01',
  ])
  assert.equal(Object.hasOwn(third, 'older_before'), false)
})

test('empty records arrays and zero daily totals remain successful responses', async () => {
  const emptyResponses = [
    ['listFoodEntries', { entries: [], totals: { calories: 0, entry_count: 0 }, remaining: { calories: 0 }, goals: null }],
    ['listMoodEntries', { entries: [] }],
    ['listWorkoutLogs', { workouts: [] }],
    ['listSleepLogs', { sleep_logs: [] }],
    ['getFeed', { days: [], older_before: '2026-09-15' }],
  ]
  for (const [name, body] of emptyResponses) {
    const { client } = makeClient([{ body }])
    assert.deepEqual(await client.api[name](), body, name)
  }
})

test('request validation does not invent minLength, positive-id or required entry restrictions', async () => {
  for (const [name, args, body] of [
    ['createFoodEntries', [{ input: '' }], { input: '' }],
    ['parseFoodEntries', [{ input: '' }], { input: '' }],
    ['createMoodEntry', [{ body: '' }], { body: '' }],
    ['updateFoodEntry', [0, {}], {}],
    ['deleteMoodEntry', [-1], undefined],
  ]) {
    const { client, calls } = makeClient([{ body: {} }])
    await client.api[name](...args)
    assert.equal(calls.length, 1, name)
    if (body !== undefined) assert.deepEqual(JSON.parse(calls[0].init.body), body, name)
  }
})

test('invalid request inputs reject before making any HTTP request', async () => {
  const invalid = [
    ['createFoodEntries', [{}]],
    ['createFoodEntries', [{ input: 42 }]],
    ['createFoodEntries', [{ input: 'eggs', meal_type: 'brunch' }]],
    ['parseFoodEntries', [undefined]],
    ['createMoodEntry', [{ logged_at: mood.logged_at }]],
    ['createMoodEntry', [{ body: null }]],
    ['updateFoodEntry', ['11', { entry: { calories: 1 } }]],
    ['updateFoodEntry', [11, { entry: { calories: 1.25 } }]],
    ['updateFoodEntry', [11, undefined]],
    ['deleteFoodEntry', [11.5]],
    ['deleteMoodEntry', [NaN]],
    ['listFoodEntries', [{ date: 42 }]],
    ['getFeed', [{ before: false }]],
  ]
  const { TallyApiError } = require('../ts/dist/TallySDK.js')
  for (const [name, args] of invalid) {
    const { client, calls } = makeClient([])
    await assert.rejects(() => client.api[name](...args), err => {
      assert.ok(err instanceof TallyApiError, name)
      assert.equal(err.code, 'request_validation', name)
      assert.equal(err.operation, name)
      return true
    })
    assert.equal(calls.length, 0, name + ' must not reach the network')
  }
})

test('every endpoint preserves documented HTTP 401 authentication errors', async () => {
  const { TallyApiError } = require('../ts/dist/TallySDK.js')
  const body = { error: 'Authentication required' }
  for (const operation of OPERATIONS) {
    const { client, calls } = makeClient([{ status: 401, body }])
    await assert.rejects(() => client.api[operation.name](...structuredClone(operation.args)), err => {
      assert.ok(err instanceof TallyApiError)
      assert.equal(err.code, 'http')
      assert.equal(err.operation, operation.name)
      assert.equal(err.status, 401)
      assert.deepEqual(err.response, body)
      return true
    })
    assert.equal(calls.length, 1, 'authentication failures must not be retried implicitly')
  }
})

test('all four documented validation-error endpoints preserve HTTP 422 details', async () => {
  const body = { error: 'Validation failed', errors: ['Cannot parse the supplied text', 'Try a more specific input'] }
  for (const name of ['createFoodEntries', 'parseFoodEntries', 'updateFoodEntry', 'createMoodEntry']) {
    const operation = OPERATIONS.find(op => op.name === name)
    const { client, calls } = makeClient([{ status: 422, body }])
    await assert.rejects(() => client.api[name](...structuredClone(operation.args)), err => {
      assert.equal(err.code, 'http')
      assert.equal(err.status, 422)
      assert.deepEqual(err.response, body)
      return true
    })
    assert.equal(calls.length, 1)
  }
})

test('network rejection is a transport error with the original cause, never an empty success', async () => {
  const cause = new TypeError('offline fixture: connection closed')
  const { client, calls } = makeClient([cause])
  await assert.rejects(() => client.api.listFoodEntries(), err => {
    assert.equal(err.code, 'transport')
    assert.equal(err.operation, 'listFoodEntries')
    assert.equal(err.status, undefined)
    assert.equal(err.cause, cause)
    return true
  })
  assert.equal(calls.length, 1)
})

test('malformed 2xx JSON rejects instead of returning undefined or an empty collection', async () => {
  for (const raw of ['{broken', '', '<html>proxy failure</html>']) {
    const { client } = makeClient([{ status: 200, raw }])
    await assert.rejects(() => client.api.listFoodEntries(), err => {
      assert.equal(err.code, 'response_validation')
      assert.equal(err.status, 200)
      return true
    })
  }
})

test('response validation rejects actual schema violations without coercing away evidence', async () => {
  for (const [name, body] of [
    ['listFoodEntries', { entries: {} }],
    ['listFoodEntries', { entries: [{ id: '11' }] }],
    ['listFoodEntries', { entries: [{ meal_type: 'brunch' }] }],
    ['listWorkoutLogs', { workouts: [{ distance_m: 2.5 }] }],
    ['listSleepLogs', { sleep_logs: [{ total_sleep_seconds: '25200' }] }],
    ['getFeed', { days: [{ items: [{ type: 'food', id: 11 }] }] }],
    ['getFeed', { days: [{ items: [{ type: 'unsupported', id: 11, time_label: '8 AM' }] }] }],
  ]) {
    const { client } = makeClient([{ body }])
    await assert.rejects(() => client.api[name](), err => {
      assert.equal(err.code, 'response_validation', name)
      assert.equal(err.status, 200, name)
      assert.deepEqual(err.response, body, name)
      return true
    })
  }
})

test('FoodEntry.list unwraps the documented entries response envelope', async () => {
  const entry = { id: 11, name: 'Scrambled eggs', calories: 180, protein_g: 12 }
  const calls = []
  const client = new TallySDK({
    apikey: 'offline-test-placeholder',
    system: {
      fetch: async (url, init) => {
        calls.push({ url, init })
        // Shape from .sdk/def/openapi.yaml, FoodEntriesResponse.
        return new Response(JSON.stringify({
          date: '2026-09-29',
          entries: [entry],
          totals: { calories: 180, protein_g: 12, carbs_g: 0, fat_g: 0 },
          remaining: { calories: 1820, protein_g: 88, carbs_g: 200, fat_g: 60 },
          goals: { calories: 2000, protein_g: 100, carbs_g: 200, fat_g: 60 },
        }), { status: 200, headers: { 'content-type': 'application/json' } })
      },
    },
  })

  const result = await client.FoodEntry().list({ date: '2026-09-29' })

  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'https://www.logwithtally.com/api/v1/food_entries?date=2026-09-29')
  assert.equal(calls[0].init.method, 'GET')
  assert.equal(calls[0].init.headers.authorization, 'Bearer offline-test-placeholder')
  assert.equal(calls[0].init.body, undefined)
  assert.equal(result.length, 1, 'must retain the entry in the API response')
  assert.deepEqual(result[0].data(), entry)
})
