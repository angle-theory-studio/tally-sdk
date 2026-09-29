// Validate the actual npm tarball, including loading it outside this source tree.
// Usage: node checks/package-artifact.cjs /path/to/pack.json
// Create that JSON with: npm pack --json --ignore-scripts --pack-destination DIR
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const crypto = require('node:crypto')
const { execFileSync } = require('node:child_process')

const report = path.resolve(process.argv[2] || 'pack.json')
const records = JSON.parse(fs.readFileSync(report, 'utf8'))
assert.equal(records.length, 1, 'pack must contain exactly one package')
const packed = records[0]
const expected = require('../ts/package.json')
assert.equal(packed.name, expected.name)
assert.equal(packed.version, expected.version)
assert.match(packed.filename, /^[a-zA-Z0-9._-]+\.tgz$/)
const tarball = path.join(path.dirname(report), packed.filename)
const bytes = fs.readFileSync(tarball)
assert.equal(packed.integrity, 'sha512-' + crypto.createHash('sha512').update(bytes).digest('base64'))

const files = new Map(packed.files.map(file => [file.path, file]))
for (const required of [expected.main, expected.types, 'package.json', 'README.md', 'LICENSE']) {
  assert.ok(files.has(required), `tarball missing ${required}`)
  assert.ok(files.get(required).size > 0, `tarball has empty ${required}`)
}
for (const file of files.keys()) {
  assert.ok(!/(^|\/)(node_modules|dist-test|\.sdk|\.github|\.npmrc)(\/|$)|(^|\/)\.env([./]|$)/.test(file),
    `unexpected development/configuration file in package: ${file}`)
}

const isolated = fs.mkdtempSync(path.join(os.tmpdir(), 'tally-package-'))
try {
  execFileSync('tar', ['-xzf', tarball, '-C', isolated], { stdio: 'pipe' })
  const installed = path.join(isolated, 'package')
  const manifest = JSON.parse(fs.readFileSync(path.join(installed, 'package.json'), 'utf8'))
  assert.equal(manifest.name, expected.name)
  assert.equal(manifest.version, expected.version)
  assert.equal(manifest.main, expected.main)
  assert.equal(manifest.types, expected.types)
  assert.ok(fs.readFileSync(path.join(installed, manifest.types), 'utf8').length > 0)
  // A fresh Node process must resolve every runtime import from the tarball.
  // No source checkout or its node_modules is added to the resolution path.
  const smoke = `
    const assert = require('node:assert/strict')
    const { TallySDK, TallyApiError } = require('./package')
    assert.equal(typeof TallySDK, 'function')
    assert.equal(typeof TallyApiError, 'function')
    const response = { days: [], older_before: '2026-09-15' }
    const calls = []
    const client = new TallySDK({
      apikey: 'offline-test-placeholder',
      system: { fetch: async (url, init) => {
        calls.push({ url, init })
        return new Response(JSON.stringify(response), {
          status: 200, headers: { 'content-type': 'application/json' }
        })
      } }
    })
    assert.equal(typeof client.FoodEntry().list, 'function')
    assert.equal(typeof client.Feed().list, 'function')
    for (const name of [
      'getFeed', 'listFoodEntries', 'createFoodEntries', 'parseFoodEntries',
      'updateFoodEntry', 'deleteFoodEntry', 'listMoodEntries', 'createMoodEntry',
      'deleteMoodEntry', 'listWorkoutLogs', 'listSleepLogs'
    ]) assert.equal(typeof client.api[name], 'function', name + ' is missing')
    ;(async () => {
      assert.deepEqual(await client.api.getFeed(), response)
      assert.equal(calls.length, 1)
      assert.equal(calls[0].url, 'https://www.logwithtally.com/api/v1/feed')
      assert.equal(calls[0].init.method, 'GET')
      assert.equal(calls[0].init.body, undefined)
      assert.equal(calls[0].init.headers.authorization, 'Bearer offline-test-placeholder')
    })().catch(error => { console.error(error); process.exitCode = 1 })
  `
  const env = { ...process.env }
  delete env.NODE_PATH
  execFileSync(process.execPath, ['-e', smoke], { cwd: isolated, env, stdio: 'pipe' })
  console.log(`Package verified: ${packed.name}@${packed.version}; ${files.size} files; isolated import succeeded`)
} finally {
  fs.rmSync(isolated, { recursive: true, force: true })
}
