# Tally TypeScript SDK

Unofficial SDK for the personal nutrition tracker at [logwithtally.com](https://www.logwithtally.com), generated and customized with [Voxgig SDK tools](https://voxgig.com/sdk). This is not Tally Forms or Tally's governance API.

**Start here:** [source installation and verification](SUBMISSION.md) · [developer experience report](DX_REPORT.md) · [audit](AUDIT.md).

The SDK provides typed operations for all 11 HTTP operations in the provider's OpenAPI specification. The `api` methods preserve full response envelopes, including food totals and pagination cursors. A compatible entity interface is also available. The project is MIT licensed; no npm release or release tag is claimed.

## Build from source

Requires Node.js 24 and npm. Run in PowerShell, Command Prompt or a Unix shell:

```sh
git clone https://github.com/angle-theory-studio/tally-sdk.git
cd tally-sdk/ts
npm ci
npm run build
npm test
node --test "../checks/*.test.cjs"
```

Cross-platform build and offline checks run in GitHub Actions. For package checks, type checks and regeneration, see [SUBMISSION.md](SUBMISSION.md).

## Quickstart

Run this CommonJS example from the repository root after building. Set `TALLY_APIKEY` in the process environment to a key from your own Tally account. API access and account requirements must be checked with the provider.

<!-- verified-example: typed-api -->
```javascript
const { TallySDK } = require('./ts/dist/TallySDK.js')

async function main() {
  const client = new TallySDK({ apikey: process.env.TALLY_APIKEY })
  const feed = await client.api.getFeed()
  console.log(feed.days)

  if (feed.older_before) {
    const older = await client.api.getFeed({ before: feed.older_before })
    console.log(older.days)
  }

  const food = await client.api.listFoodEntries({ date: '2026-09-29' })
  console.log(food.entries, food.totals, food.remaining, food.goals)
}

main().catch(console.error)
```

The typed `api` methods return the provider's complete JSON response and reject unsuccessful requests. Response schemas preserve upstream optional and nullable fields; consumers should handle absent values. The provider specification is committed at `.sdk/def/openapi.yaml`.

## Operations

| Method | HTTP operation | Result |
| --- | --- | --- |
| `api.getFeed(query?)` | `GET /feed` | Days and pagination cursor |
| `api.listFoodEntries(query?)` | `GET /food_entries` | Entries, totals, remaining values and goals |
| `api.createFoodEntries(body)` | `POST /food_entries` | Created entries and aggregate values |
| `api.parseFoodEntries(body)` | `POST /food_entries/parse` | Parsed entries; does not save them |
| `api.updateFoodEntry(id, body)` | `PATCH /food_entries/{id}` | Updated entry |
| `api.deleteFoodEntry(id)` | `DELETE /food_entries/{id}` | Remaining aggregate values |
| `api.listMoodEntries(query?)` | `GET /mood_entries` | Mood entries |
| `api.createMoodEntry(body)` | `POST /mood_entries` | Created mood entry |
| `api.deleteMoodEntry(id)` | `DELETE /mood_entries/{id}` | Deletion result |
| `api.listWorkoutLogs(query?)` | `GET /workout_logs` | Workout entries |
| `api.listSleepLogs(query?)` | `GET /sleep_logs` | Sleep entries |

The PATCH body is `{ entry: { ... } }`; the numeric ID is sent in the path. Create and parse food requests are separate operations. Types are exported from the SDK entry point.

## Legacy entity interface

The original entity methods remain available. `list()` returns an array of entities, each exposing `.data()`. Use `api` methods when full response metadata is required.

```ts
import { TallySDK } from '@angle-theory-studio/tally-sdk'

const client = new TallySDK({ apikey: process.env.TALLY_APIKEY })
const feeds = await client.Feed().list()
for (const feed of feeds) {
  console.log(feed.data())
}
```

This import refers to the prepared package name; use the source entry point above until a package is installed. Corrected response declarations may require callers of legacy envelope operations to narrow union types. See [CHANGELOG.md](CHANGELOG.md).

## Verification and limits

Offline contract tests check request URLs, methods, bodies, authentication, all documented response envelopes, pagination and failure paths. TypeScript checks include accepted and rejected usage. Package checks inspect and load the actual packed artifact. These checks do not establish compatibility with an authenticated live account.

A separate read-only live check is available as `node checks/live-readonly.cjs` after setting `TALLY_APIKEY`. It makes GET requests only and does not print returned personal records or the token. It is never part of the default offline test run. Actual live-test status is recorded in [AUDIT.md](AUDIT.md).

Human work time was not measured, so compliance with the assignment's 30-minute human-work limit is not claimed. No npm publication has been performed.

## Regenerate

```sh
cd .sdk
npm ci
npm run generate
```

Modify the model, templates or components; never hand-patch generated files in `ts/`. Candidate-maintained root documentation and attribution are preserved using the supported `top.active:false` project setting. Target source and documentation are regenerated. [AGENTS.md](AGENTS.md) documents the contributor workflow.

## Security and attribution

See [SECURITY.md](SECURITY.md) for reporting guidance and [LICENSE](LICENSE) for MIT terms and attribution. The project is maintained in the candidate's [GitHub account](https://github.com/angle-theory-studio) and is not endorsed by the API provider.
