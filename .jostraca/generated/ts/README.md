# Tally TypeScript SDK

Unofficial TypeScript SDK for the [Tally nutrition tracker](https://www.logwithtally.com), generated with Voxgig SDK tools.

## Recommended API

Use `client.api` for all 11 documented HTTP operations. Each method returns
its complete, typed JSON response and checks the declared response schema.
Food entries retain daily totals, remaining macros and goals; feed responses
retain `older_before` for pagination. Create and preview are separate methods.

| Method | HTTP endpoint | Response |
| --- | --- | --- |
| `listFoodEntries({ date? })` | GET /food_entries | Entries, totals, remaining macros, goals and date |
| `createFoodEntries({ input, meal_type?, date? })` | POST /food_entries | All created entries, totals and remaining macros |
| `parseFoodEntries({ input, meal_type? })` | POST /food_entries/parse | Preview with raw input, meal type and parsed entries |
| `updateFoodEntry(id, { entry? })` | PATCH /food_entries/{id} | Updated food entry |
| `deleteFoodEntry(id)` | DELETE /food_entries/{id} | Message, totals and remaining macros |
| `listMoodEntries({ date? })` | GET /mood_entries | Entries envelope |
| `createMoodEntry({ body, logged_at? })` | POST /mood_entries | Created mood entry |
| `deleteMoodEntry(id)` | DELETE /mood_entries/{id} | Message envelope |
| `listWorkoutLogs({ date? })` | GET /workout_logs | Date and workouts envelope |
| `listSleepLogs({ date? })` | GET /sleep_logs | Date and sleep sessions envelope |
| `getFeed({ before? })` | GET /feed | Days and pagination cursor |

The query object is optional on GET methods. Response properties remain
optional or nullable exactly where declared by the source specification.
Invalid requests, transport failures, non-2xx HTTP responses and invalid
response shapes reject with `TallyApiError`.

See the [API contract](https://github.com/angle-theory-studio/tally-sdk/blob/main/API_CONTRACT.md),
[generated exact types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts),
and [project README](https://github.com/angle-theory-studio/tally-sdk/blob/main/README.md).

The capitalised entity interface, such as `client.FoodEntry()`, remains
available. Its list methods return entity arrays and do not retain surrounding
response metadata. Legacy create/parse/remove entity data can hold response
envelopes; prefer `client.api` for operation-specific return types.

## Install

This package has no npm release or release tag. Build the committed
source using [SUBMISSION.md](https://github.com/angle-theory-studio/tally-sdk/blob/main/SUBMISSION.md). From the repository root:

```sh
cd ts
npm ci
npm run build
npm test
```

The CommonJS entry point is `ts/dist/TallySDK.js`; declarations are in
`ts/dist/TallySDK.d.ts`. The package name below describes the prepared package,
not an already published npm release.

## Client setup and legacy entity example

### 1. Create a client

```ts
import { TallySDK } from '@angle-theory-studio/tally-sdk'

const client = new TallySDK({
  apikey: process.env.TALLY_APIKEY,
})
```

### 2. List feed records

This legacy `list()` method resolves to an array of Feed entity
instances. Call `.data()` on each returned instance to read its record.
Use `client.api` to retain the complete response envelope and pagination metadata:

```ts
const feeds = await client.Feed().list()

for (const feed of feeds) {
  console.log(feed.data())
}
```

## Error handling

Recommended `client.api` calls reject with `TallyApiError`. Its `code` is
`request_validation`, `transport`, `http` or `response_validation`.
HTTP errors preserve the status and response body in `status` and
`response`; inspect that body for the API's `error` or `errors` details.
For transport failures, `cause` retains the underlying error when available.

## Reference

### TallySDK

#### Constructor

```ts
new TallySDK(options?: {
  apikey?: string
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef \| Error>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult \| Error>` | Build and send an HTTP request. |
| `Feed(entopts?)` | `FeedEntity` | Create a Feed entity instance with optional entity options. |
| `FoodEntry(entopts?)` | `FoodEntryEntity` | Create a FoodEntry entity instance with optional entity options. |
| `MoodEntry(entopts?)` | `MoodEntryEntity` | Create a MoodEntry entity instance with optional entity options. |
| `SleepLog(entopts?)` | `SleepLogEntity` | Create a SleepLog entity instance with optional entity options. |
| `WorkoutLog(entopts?)` | `WorkoutLogEntity` | Create a WorkoutLog entity instance with optional entity options. |
| `tester(testopts?, sdkopts?)` | `TallySDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `TallySDK.test(testopts?, sdkopts?)` | `TallySDK` | Create a test-mode client. |

### Legacy entity interface

Each entity exposes only the operations listed for it below. The data types
are distinct from the entity classes. `FoodEntry.data()` and
`MoodEntry.data()` use unions because different operations store different
response shapes. The [exact types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
separate request bodies from responses.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity. |
| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity. |
| `remove` | `remove(reqmatch?, ctrl?): Promise<Entity>` | Remove an entity. |
| `data` | `data(data?: Partial<Data>): Data` | Get or set entity data. |
| `match` | `match(match?: Partial<Data>): Partial<Data>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): TallySDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

On success, legacy entity operations return entity instances or arrays of
instances. Read each instance with `.data()`; a raw response envelope may
be stored there by create, parse or remove:

- `create` and `update` resolve to a single entity object.
- `list` resolves to an **array** of entity instances. The array has no `.data()` or `.ok`; call `.data()` on each item.
- `remove` resolves to the entity instance and marks `.deleted()` as true.

Entity operations throw on failure by default. Disabling throwing through
legacy control options changes that behavior. The recommended `client.api`
methods always reject failures and return operation-specific JSON bodies on
success. The low-level `direct()` method returns transport result information
as described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

For a non-2xx HTTP response, `ok` is false, `status` is the HTTP status,
and `data` contains the parsed body when available; `err` is not guaranteed.
Transport and permission failures can instead return `{ ok: false, err }`,
and request preparation can return an `Error` directly. Check both forms.
Unlike `client.api`, `direct()` does not validate the response against an
operation schema; invalid JSON can leave `data` undefined even on HTTP success.

### FetchDef shape

On success, `prepare()` returns the following definition; on preparation or
permission failure it returns an `Error`. It never sends the request:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Legacy entity field inventories

The following tables combine fields inferred from requests and responses;
they are not individual response schemas. Use the operation-specific
[exact types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts).

#### Feed

| Field | Description |
| --- | --- |
| `date` |  |
| `items` |  |
| `relative_label` | "Today", "Yesterday", or the weekday name |

Operations: list.

API path: `/feed`

#### FoodEntry

| Field | Description |
| --- | --- |
| `caffeine_mg` |  |
| `calories` |  |
| `carbs_g` |  |
| `confirmed` |  |
| `date` | Date to log against (YYYY-MM-DD). |
| `entry` |  |
| `fat_g` |  |
| `id` |  |
| `input` | Natural-language food description, e.g. |
| `logged_on` |  |
| `meal_type` |  |
| `name` |  |
| `protein_g` |  |

Operations: create, list, remove, update.

API path: `/food_entries`

#### MoodEntry

| Field | Description |
| --- | --- |
| `body` |  |
| `id` |  |
| `logged_at` | ISO 8601 timestamp. |
| `time_label` | Human-readable local time |

Operations: create, list, remove.

API path: `/mood_entries`

#### SleepLog

| Field | Description |
| --- | --- |
| `awake_seconds` |  |
| `date` |  |
| `deep_sleep_seconds` |  |
| `duration_label` | Human-friendly duration, e.g. |
| `ended_at` |  |
| `id` |  |
| `light_sleep_seconds` |  |
| `rem_sleep_seconds` |  |
| `sleep_score` |  |
| `source` |  |
| `started_at` |  |
| `total_sleep_seconds` |  |

Operations: list.

API path: `/sleep_logs`

#### WorkoutLog

| Field | Description |
| --- | --- |
| `activity_type` |  |
| `calories` |  |
| `distance_m` | Distance in metres |
| `distance_miles` | Distance in miles (rounded to 1 decimal) |
| `duration_label` | Human-friendly duration, e.g. |
| `id` |  |
| `logged_on` |  |
| `moving_time_s` | Moving time in seconds |
| `name` |  |
| `occurred_at` |  |
| `source` |  |

Operations: list.

API path: `/workout_logs`



## Entities


### Feed

Create an instance: `const feed = client.Feed()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Legacy combined field inventory

These inferred fields combine requests and responses. Use the
[exact operation types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
for required fields, enums and nullability.

| Field | Type | Description |
| --- | --- | --- |
| `date` | `string` |  |
| `items` | `any[]` |  |
| `relative_label` | `string` | "Today", "Yesterday", or the weekday name |

#### Example: List

```ts
const feeds = await client.Feed().list()
```


### FoodEntry

Create an instance: `const food_entry = client.FoodEntry()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Legacy combined field inventory

These inferred fields combine requests and responses. Use the
[exact operation types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
for required fields, enums and nullability.

| Field | Type | Description |
| --- | --- | --- |
| `caffeine_mg` | `number` |  |
| `calories` | `number` |  |
| `carbs_g` | `number` |  |
| `confirmed` | `boolean` |  |
| `date` | `string` | Date to log against (YYYY-MM-DD). |
| `entry` | `Record<string, any>` |  |
| `fat_g` | `number` |  |
| `id` | `number` |  |
| `input` | `string` | Natural-language food description, e.g. |
| `logged_on` | `string` |  |
| `meal_type` | `string` |  |
| `name` | `string` |  |
| `protein_g` | `number` |  |

#### Example: List

```ts
const food_entrys = await client.FoodEntry().list()
```

#### Example: Create

```ts
const food_entry = await client.FoodEntry().create({
  input: 'example_input',
})
```


### MoodEntry

Create an instance: `const mood_entry = client.MoodEntry()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `remove(match)` | Remove the matching entity. |

#### Legacy combined field inventory

These inferred fields combine requests and responses. Use the
[exact operation types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
for required fields, enums and nullability.

| Field | Type | Description |
| --- | --- | --- |
| `body` | `string` |  |
| `id` | `number` |  |
| `logged_at` | `string` | ISO 8601 timestamp. |
| `time_label` | `string` | Human-readable local time |

#### Example: List

```ts
const mood_entrys = await client.MoodEntry().list()
```

#### Example: Create

```ts
const mood_entry = await client.MoodEntry().create({
  body: 'example_body',
})
```


### SleepLog

Create an instance: `const sleep_log = client.SleepLog()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Legacy combined field inventory

These inferred fields combine requests and responses. Use the
[exact operation types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
for required fields, enums and nullability.

| Field | Type | Description |
| --- | --- | --- |
| `awake_seconds` | `number` |  |
| `date` | `string` |  |
| `deep_sleep_seconds` | `number` |  |
| `duration_label` | `string` | Human-friendly duration, e.g. |
| `ended_at` | `string` |  |
| `id` | `number` |  |
| `light_sleep_seconds` | `number` |  |
| `rem_sleep_seconds` | `number` |  |
| `sleep_score` | `number` |  |
| `source` | `string` |  |
| `started_at` | `string` |  |
| `total_sleep_seconds` | `number` |  |

#### Example: List

```ts
const sleep_logs = await client.SleepLog().list()
```


### WorkoutLog

Create an instance: `const workout_log = client.WorkoutLog()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Legacy combined field inventory

These inferred fields combine requests and responses. Use the
[exact operation types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
for required fields, enums and nullability.

| Field | Type | Description |
| --- | --- | --- |
| `activity_type` | `string` |  |
| `calories` | `number` |  |
| `distance_m` | `number` | Distance in metres |
| `distance_miles` | `number` | Distance in miles (rounded to 1 decimal) |
| `duration_label` | `string` | Human-friendly duration, e.g. |
| `id` | `number` |  |
| `logged_on` | `string` |  |
| `moving_time_s` | `number` | Moving time in seconds |
| `name` | `string` |  |
| `occurred_at` | `string` |  |
| `source` | `string` |  |

#### Example: List

```ts
const workout_logs = await client.WorkoutLog().list()
```

## Entity state and transport

Legacy `list()` returns a new array of entity instances. Read those returned
instances with `.data()`; the parent entity does not become the returned
collection. Collection envelopes, totals and pagination metadata are available
through the corresponding `client.api` method.

```ts
const parent = client.WorkoutLog()
const workouts = await parent.list()
for (const workout of workouts) {
  console.log(workout.data())
}
```

Successful create and update operations store their response data on the
returned entity. Remove returns the same entity, stores the removal response
and marks `.deleted()` true. Call `make()` for a fresh instance with the same
client and options.

The typed `client.api` methods use the existing `direct()` transport with
configured authentication, base URL and `system.fetch`. They honor
`allow.op` for `direct` and the configured `allow.method` restrictions.
They validate declared request and response types and throw `TallyApiError`.
The legacy entity feature pipeline and generic test feature are separate;
use an injected `system.fetch` for offline tests of `client.api`.

The included test feature exercises legacy entities. The project also has
[independent contract checks](https://github.com/angle-theory-studio/tally-sdk/tree/main/checks)
covering complete responses, request placement, errors, permissions and types.

## Full reference

See the [API contract](https://github.com/angle-theory-studio/tally-sdk/blob/main/API_CONTRACT.md)
and [legacy reference](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/REFERENCE.md).
