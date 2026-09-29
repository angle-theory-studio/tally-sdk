// Offline transport regressions. Build ts/ first, then run:
// node --test checks/transport.test.cjs
const test = require('node:test')
const assert = require('node:assert/strict')
const { TallySDK, stdutil } = require('../ts/dist/TallySDK.js')

function captureClient(response, options = {}) {
  const calls = []
  const client = new TallySDK({
    apikey: 'offline-test-placeholder',
    ...options,
    system: {
      fetch: async (url, init) => {
        calls.push({ url, init })
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      },
    },
  })
  return { client, calls }
}

for (const [entity, path] of [
  ['FoodEntry', 'food_entries'],
  ['MoodEntry', 'mood_entries'],
]) {
  test(`${entity}.remove puts id only in the path and sends no body`, async () => {
    const { client, calls } = captureClient({ message: 'Entry removed' })
    const instance = client[entity]()
    instance.data({ id: 11 })
    await instance.remove({ id: 11 })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, `https://www.logwithtally.com/api/v1/${path}/11`)
    assert.equal(calls[0].init.method, 'DELETE')
    assert.equal(calls[0].init.body, undefined)
  })
}

for (const [entity, path, queryName, response] of [
  ['FoodEntry', 'food_entries', 'date', { entries: [] }],
  ['MoodEntry', 'mood_entries', 'date', { entries: [] }],
  ['WorkoutLog', 'workout_logs', 'date', { workouts: [] }],
  ['SleepLog', 'sleep_logs', 'date', { sleep_logs: [] }],
  ['Feed', 'feed', 'before', { days: [], older_before: '2026-09-15' }],
]) {
  test(`${entity}.list preserves its date query and sends no body`, async () => {
    const { client, calls } = captureClient(response)
    const instance = client[entity]()
    // An existing entity's data must not become a GET request body.
    instance.data({ date: '2026-09-01' })
    await instance.list({ [queryName]: '2026-09-29' })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, `https://www.logwithtally.com/api/v1/${path}?${queryName}=2026-09-29`)
    assert.equal(calls[0].init.method, 'GET')
    assert.equal(calls[0].init.body, undefined)
  })
}

test('query preparation excludes declared path arguments without losing false, zero or empty values', () => {
  const query = stdutil.prepareQuery({
    utility: stdutil,
    point: { args: { params: [{ name: 'id', kind: 'param' }] }, params: [] },
    reqmatch: {
      id: 11, active: false, offset: 0, empty: '', date: '2026-09-29',
      omitted: null, absent: undefined, $action: 'preview',
    },
  })
  assert.deepEqual(query, { active: false, offset: 0, empty: '', date: '2026-09-29' })
})

test('query preparation retains support for the legacy parameter-name list', () => {
  const query = stdutil.prepareQuery({
    utility: stdutil,
    point: { params: ['id'] },
    reqmatch: { id: 11, date: '2026-09-29' },
  })
  assert.deepEqual(query, { date: '2026-09-29' })
})

test('raw transport encodes path and query values exactly once', async () => {
  // Synthetic transport values exercise encoding; the Tally API's id is integer.
  // No claim is made that Tally accepts these extra query fields.
  const { client, calls } = captureClient({ ok: true })
  const value = 'a/b ?&+#%é'
  await client.direct({
    path: '/transport/{value}',
    params: { value },
    query: { 'query key': value, date: '2026-09-29', active: false, offset: 0, empty: '', omitted: null },
  })
  assert.equal(calls.length, 1)
  const url = new URL(calls[0].url)
  assert.equal(url.origin, 'https://www.logwithtally.com')
  assert.equal(url.pathname, '/api/v1/transport/' + encodeURIComponent(value))
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    'query key': value, date: '2026-09-29', active: 'false', offset: '0', empty: '',
  })
  assert.equal([...url.searchParams].length, 5)
  assert.equal(calls[0].init.method, 'GET')
  assert.equal(calls[0].init.body, undefined)
})

for (const entryPoint of ['prepare', 'direct']) {
  test(`${entryPoint} normalizes lowercase get and permits it under a GET-only policy`, async () => {
    const { client, calls } = captureClient({ entries: [] }, { allow: { method: 'GET' } })
    const result = await client[entryPoint]({ path: '/food_entries', method: 'get' })
    assert.ok(!(result instanceof Error))
    if (entryPoint === 'prepare') {
      assert.equal(result.method, 'GET')
      assert.equal(calls.length, 0, 'preparation must not perform a request')
    } else {
      assert.equal(result.ok, true)
      assert.equal(calls.length, 1)
      assert.equal(calls[0].init.method, 'GET')
    }
  })

  for (const method of ['post', 'PATCH', 'DELETE', 'ET']) {
    test(`${entryPoint} blocks ${method} before fetch under a GET-only policy`, async () => {
      const { client, calls } = captureClient({ ok: true }, { allow: { method: 'GET' } })
      const result = await client[entryPoint]({ path: '/food_entries', method })
      assert.ok(result instanceof Error, 'a disallowed method must return an error')
      assert.equal(result.code, 'spec_method_allow')
      assert.equal(calls.length, 0, 'the denied request must never reach the transport')
    })
  }
}
