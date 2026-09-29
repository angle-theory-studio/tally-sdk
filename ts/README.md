# Tally TypeScript SDK



The TypeScript SDK for the Tally API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Feed()` — each with a small set of operations (`list`, `create`, `update`, `remove`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`):

- Releases: [https://github.com/angle-theory-studio/tally-sdk/releases](https://github.com/angle-theory-studio/tally-sdk/releases)


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { TallySDK } from '@angle-theory-studio/tally-sdk'

const client = new TallySDK({
  apikey: process.env.TALLY_APIKEY,
})
```

### 2. List feed records

`list()` resolves to an array of Feed ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
`.data()` on one for the record it holds:

```ts
const feeds = await client.Feed().list()

for (const feed of feeds) {
  console.log(feed)
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const workoutlogs = await client.WorkoutLog().list()
  console.log(workoutlogs)
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
value or an `Error`, so check the result before using it:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (result instanceof Error) {
  throw result
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result instanceof Error) {
  throw result
}
if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = TallySDK.test()

const workoutlog = await client.WorkoutLog().list()
// workoutlog is the entity, populated with mock response data
// — call workoutlog.data() for the record itself
console.log(workoutlog)
```

You can also use the instance method:

```ts
const client = new TallySDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.WorkoutLog()

// First call runs the operation and stores its result
await entity.list()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data.id)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new TallySDK({
  apikey: '...',
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
TALLY_TEST_LIVE=TRUE
TALLY_APIKEY=<your-key>
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


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
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Feed(data?)` | `FeedEntity` | Create a Feed entity instance. |
| `FoodEntry(data?)` | `FoodEntryEntity` | Create a FoodEntry entity instance. |
| `MoodEntry(data?)` | `MoodEntryEntity` | Create a MoodEntry entity instance. |
| `SleepLog(data?)` | `SleepLogEntity` | Create a SleepLog entity instance. |
| `WorkoutLog(data?)` | `WorkoutLogEntity` | Create a WorkoutLog entity instance. |
| `tester(testopts?, sdkopts?)` | `TallySDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `TallySDK.test(testopts?, sdkopts?)` | `TallySDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity. |
| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity. |
| `remove` | `remove(reqmatch?, ctrl?): Promise<void>` | Remove an entity. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): TallySDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity data directly — there is no
result envelope:

- `create` and `update` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).
- `remove` resolves to `void`.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

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

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

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

#### Fields

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

#### Fields

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

#### Fields

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

#### Fields

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

#### Fields

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

## Features

This SDK ships 1 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`test`](#test) | Test transport |

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: Test transport

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
tally/
├── src/
│   ├── TallySDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { TallySDK } from '@angle-theory-studio/tally-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const workoutlog = client.WorkoutLog()
await workoutlog.list()

// workoutlog.data() now returns the workoutlog data from the last `list`
// workoutlog.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
