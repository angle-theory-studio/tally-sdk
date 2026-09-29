// Handwritten API-contract regression check. No network requests or real tokens.
// Run from the repository root after building ts/: node --test checks/api-contract.test.cjs
const test = require('node:test')
const assert = require('node:assert/strict')
const { TallySDK } = require('../ts/dist/TallySDK.js')

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
