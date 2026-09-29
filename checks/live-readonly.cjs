// Explicit opt-in only. All operations are GETs; no token or response data is logged.
const { TallySDK } = require('../ts/dist/TallySDK.js')

async function main() {
  const apikey = process.env.TALLY_APIKEY
  if (!apikey) throw new Error('Set TALLY_APIKEY in the process environment before running this optional check.')
  const client = new TallySDK({
    apikey,
    system: {
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }),
    },
  })
  for (const method of ['getFeed', 'listFoodEntries', 'listMoodEntries', 'listWorkoutLogs', 'listSleepLogs']) {
    await client.api[method]()
    console.log(`${method}: passed`)
  }
  console.log('Five read-only calls passed. Write operations were not exercised.')
}

main().catch(error => {
  // Avoid printing server bodies, personal records or raw errors containing request data.
  console.error(process.env.TALLY_APIKEY
    ? `Read-only check failed (${error.name || 'Error'}, status ${error.status ?? 'unknown'}).`
    : error.message)
  process.exitCode = 1
})
