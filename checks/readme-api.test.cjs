// Executes the marked JavaScript quickstart exactly as written in README.md.
// The constructor uses a deterministic fetch stub; no token or network needed.
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { TallySDK } = require('../ts/dist/TallySDK.js')

const TOKEN = 'readme-offline-placeholder'
const BASE = 'https://www.logwithtally.com/api/v1'
const food = {
  entries: [{ id: 11, name: 'Eggs', calories: 180 }],
  totals: { calories: 180, entry_count: 1 },
  remaining: { calories: -10 },
  goals: null,
}

for (const paginate of [true, false]) {
  test(`README typed quickstart executes with ${paginate ? 'a cursor' : 'no cursor'}`, async () => {
    const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8')
    const blocks = [...readme.matchAll(/<!-- verified-example: typed-api -->\s*```javascript\s*\n([\s\S]*?)\n```/g)]
    assert.equal(blocks.length, 1, 'exactly one marked typed quickstart must exist')
    const source = blocks[0][1]
    const first = { days: [{ date: '2026-09-29', items: [] }] }
    if (paginate) first.older_before = '2026-09-15'
    const older = { days: [{ date: '2026-09-14', items: [] }] }
    const responses = paginate ? [first, older, food] : [first, food]
    const calls = []
    const logs = []
    const errors = []

    class OfflineSDK extends TallySDK {
      constructor(options) {
        assert.equal(options.apikey, TOKEN, 'README must pass the environment token to the SDK')
        super({
          ...options,
          system: {
            fetch: async (url, init) => {
              const index = calls.length
              calls.push({ url, init })
              assert.ok(index < responses.length, 'README made an unexpected request')
              return new Response(JSON.stringify(responses[index]), {
                status: 200,
                headers: { 'content-type': 'application/json' },
              })
            },
          },
        })
      }
    }

    // vm returns the value of the final `main().catch(console.error)` expression.
    // Await it, then reject any logged error, so the example's catch cannot hide a
    // failure. The actual snippet is not rewritten and SDK methods are not mocked.
    const completion = vm.runInNewContext(source, {
      require: request => {
        assert.equal(request, './ts/dist/TallySDK.js', 'source quickstart import must resolve from repository root')
        return { TallySDK: OfflineSDK }
      },
      process: { env: { TALLY_APIKEY: TOKEN } },
      console: {
        log: (...args) => logs.push(args),
        error: (...args) => errors.push(args),
      },
    }, { filename: 'README.md:typed-api', timeout: 1000 })

    assert.ok(completion && typeof completion.then === 'function', 'README must return its async execution promise')
    await completion
    assert.deepEqual(errors, [], 'README quickstart must not log errors')
    const expectedURLs = [BASE + '/feed']
    if (paginate) expectedURLs.push(BASE + '/feed?before=2026-09-15')
    expectedURLs.push(BASE + '/food_entries?date=2026-09-29')
    assert.deepEqual(calls.map(call => String(call.url)), expectedURLs)
    for (const { init } of calls) {
      assert.equal(init.method, 'GET')
      assert.equal(init.body, undefined)
      assert.equal(new Headers(init.headers).get('authorization'), 'Bearer ' + TOKEN)
    }
    const expectedLogs = [[first.days]]
    if (paginate) expectedLogs.push([older.days])
    expectedLogs.push([food.entries, food.totals, food.remaining, food.goals])
    assert.deepEqual(logs, expectedLogs, 'the example must expose both records and response metadata')
  })
}
