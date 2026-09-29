# Tally TypeScript SDK Reference

Legacy entity reference for the Tally TypeScript SDK.

For the recommended `client.api` methods covering all 11 HTTP operations,
see the [API contract](https://github.com/angle-theory-studio/tally-sdk/blob/main/API_CONTRACT.md)
and [project README](https://github.com/angle-theory-studio/tally-sdk/blob/main/README.md).
These methods return complete response bodies, including totals and pagination.
The [generated exact types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
are authoritative for request/response fields, enums and nullability.


## TallySDK

### Constructor

```ts
new TallySDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `TallySDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = TallySDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `TallySDK` instance in test mode.


### Instance Methods

#### `Feed(entopts?: object)`

Create a new `Feed` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `entopts` | `object` | Entity options; use the entity's data() method to set initial data. |

**Returns:** `FeedEntity` instance.

#### `FoodEntry(entopts?: object)`

Create a new `FoodEntry` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `entopts` | `object` | Entity options; use the entity's data() method to set initial data. |

**Returns:** `FoodEntryEntity` instance.

#### `MoodEntry(entopts?: object)`

Create a new `MoodEntry` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `entopts` | `object` | Entity options; use the entity's data() method to set initial data. |

**Returns:** `MoodEntryEntity` instance.

#### `SleepLog(entopts?: object)`

Create a new `SleepLog` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `entopts` | `object` | Entity options; use the entity's data() method to set initial data. |

**Returns:** `SleepLogEntity` instance.

#### `WorkoutLog(entopts?: object)`

Create a new `WorkoutLog` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `entopts` | `object` | Entity options; use the entity's data() method to set initial data. |

**Returns:** `WorkoutLogEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |

**Returns:** `Promise<{ ok, status, headers, data } | Error>`

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `TallySDK.test()`.

**Returns:** `TallySDK` instance in test mode.


---

## FeedEntity

```ts
const feed = client.Feed()
```

### Legacy combined field inventory

This inferred inventory combines request and response fields; it is not an
individual response schema. A required marker applies only to the relevant
request operation, not every response. For example, food `input` is required
by create and parse requests and is not a field on returned `FoodEntry` records.
Use the [operation-specific types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts).

| Field | Inferred type | Inferred request requirement | Description |
| --- | --- | --- | --- |
| `date` | `string` | Operation-specific; see exact types |  |
| `items` | `any[]` | Operation-specific; see exact types |  |
| `relative_label` | `string` | Operation-specific; see exact types | "Today", "Yesterday", or the weekday name |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Returns an array.

```ts
const results = await client.Feed().list()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `FeedEntity` instance with the same client and
options.

#### `client()`

Return the parent `TallySDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## FoodEntryEntity

```ts
const food_entry = client.FoodEntry()
```

### Legacy combined field inventory

This inferred inventory combines request and response fields; it is not an
individual response schema. A required marker applies only to the relevant
request operation, not every response. For example, food `input` is required
by create and parse requests and is not a field on returned `FoodEntry` records.
Use the [operation-specific types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts).

| Field | Inferred type | Inferred request requirement | Description |
| --- | --- | --- | --- |
| `caffeine_mg` | `number` | Operation-specific; see exact types |  |
| `calories` | `number` | Operation-specific; see exact types |  |
| `carbs_g` | `number` | Operation-specific; see exact types |  |
| `confirmed` | `boolean` | Operation-specific; see exact types |  |
| `date` | `string` | Operation-specific; see exact types | Date to log against (YYYY-MM-DD). |
| `entry` | `Record<string, any>` | Operation-specific; see exact types |  |
| `fat_g` | `number` | Operation-specific; see exact types |  |
| `id` | `number` | Operation-specific; see exact types |  |
| `input` | `string` | Required in applicable request; see exact types | Natural-language food description, e.g. |
| `logged_on` | `string` | Operation-specific; see exact types |  |
| `meal_type` | `string` | Operation-specific; see exact types |  |
| `name` | `string` | Operation-specific; see exact types |  |
| `protein_g` | `number` | Operation-specific; see exact types |  |

### Actions

This entity exposes custom API actions in addition to the standard
operations. Select one with `$action` in the call's argument; the
remaining keys are sent as that action's payload.

| Action | Route | Call |
| --- | --- | --- |
| `parse` | `/food_entries/parse` | `client.FoodEntry().create({ $action: 'parse', ... })` |

The legacy action resolves to an entity instance whose `.data()` contains
that action's response envelope. For a typed preview response, use
`client.api.parseFoodEntries({ input: 'eggs' })`.

```ts
const result = await client.FoodEntry().create({
  $action: 'parse',
  input: '2 scrambled eggs',
})
```

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data.

```ts
const result = await client.FoodEntry().create({
  input: 'example_input',
})
```

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Returns an array.

```ts
const results = await client.FoodEntry().list()
```

#### `remove(match: object, ctrl?: object)`

Remove the matching entity; return the entity instance with deleted() set to true.

```ts
const result = await client.FoodEntry().remove({ id: 1 })
```

#### `update(data: object, ctrl?: object)`

Update an existing entity. The data must include the entity `id`.

```ts
const result = await client.FoodEntry().update({
  id: 1,
  entry: { name: 'Updated food name' },
})
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `FoodEntryEntity` instance with the same client and
options.

#### `client()`

Return the parent `TallySDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## MoodEntryEntity

```ts
const mood_entry = client.MoodEntry()
```

### Legacy combined field inventory

This inferred inventory combines request and response fields; it is not an
individual response schema. A required marker applies only to the relevant
request operation, not every response. For example, food `input` is required
by create and parse requests and is not a field on returned `FoodEntry` records.
Use the [operation-specific types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts).

| Field | Inferred type | Inferred request requirement | Description |
| --- | --- | --- | --- |
| `body` | `string` | Required in applicable request; see exact types |  |
| `id` | `number` | Operation-specific; see exact types |  |
| `logged_at` | `string` | Operation-specific; see exact types | ISO 8601 timestamp. |
| `time_label` | `string` | Operation-specific; see exact types | Human-readable local time |

### Field Usage by Operation

| Field | list | create | remove |
| --- | --- | --- | --- |
| `body` | Yes | - | - |
| `id` | - | - | - |
| `logged_at` | - | - | - |
| `time_label` | - | - | - |

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data.

```ts
const result = await client.MoodEntry().create({
  body: 'example_body',
})
```

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Returns an array.

```ts
const results = await client.MoodEntry().list()
```

#### `remove(match: object, ctrl?: object)`

Remove the matching entity; return the entity instance with deleted() set to true.

```ts
const result = await client.MoodEntry().remove({ id: 1 })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `MoodEntryEntity` instance with the same client and
options.

#### `client()`

Return the parent `TallySDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## SleepLogEntity

```ts
const sleep_log = client.SleepLog()
```

### Legacy combined field inventory

This inferred inventory combines request and response fields; it is not an
individual response schema. A required marker applies only to the relevant
request operation, not every response. For example, food `input` is required
by create and parse requests and is not a field on returned `FoodEntry` records.
Use the [operation-specific types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts).

| Field | Inferred type | Inferred request requirement | Description |
| --- | --- | --- | --- |
| `awake_seconds` | `number` | Operation-specific; see exact types |  |
| `date` | `string` | Operation-specific; see exact types |  |
| `deep_sleep_seconds` | `number` | Operation-specific; see exact types |  |
| `duration_label` | `string` | Operation-specific; see exact types | Human-friendly duration, e.g. |
| `ended_at` | `string` | Operation-specific; see exact types |  |
| `id` | `number` | Operation-specific; see exact types |  |
| `light_sleep_seconds` | `number` | Operation-specific; see exact types |  |
| `rem_sleep_seconds` | `number` | Operation-specific; see exact types |  |
| `sleep_score` | `number` | Operation-specific; see exact types |  |
| `source` | `string` | Operation-specific; see exact types |  |
| `started_at` | `string` | Operation-specific; see exact types |  |
| `total_sleep_seconds` | `number` | Operation-specific; see exact types |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Returns an array.

```ts
const results = await client.SleepLog().list()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `SleepLogEntity` instance with the same client and
options.

#### `client()`

Return the parent `TallySDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## WorkoutLogEntity

```ts
const workout_log = client.WorkoutLog()
```

### Legacy combined field inventory

This inferred inventory combines request and response fields; it is not an
individual response schema. A required marker applies only to the relevant
request operation, not every response. For example, food `input` is required
by create and parse requests and is not a field on returned `FoodEntry` records.
Use the [operation-specific types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts).

| Field | Inferred type | Inferred request requirement | Description |
| --- | --- | --- | --- |
| `activity_type` | `string` | Operation-specific; see exact types |  |
| `calories` | `number` | Operation-specific; see exact types |  |
| `distance_m` | `number` | Operation-specific; see exact types | Distance in metres |
| `distance_miles` | `number` | Operation-specific; see exact types | Distance in miles (rounded to 1 decimal) |
| `duration_label` | `string` | Operation-specific; see exact types | Human-friendly duration, e.g. |
| `id` | `number` | Operation-specific; see exact types |  |
| `logged_on` | `string` | Operation-specific; see exact types |  |
| `moving_time_s` | `number` | Operation-specific; see exact types | Moving time in seconds |
| `name` | `string` | Operation-specific; see exact types |  |
| `occurred_at` | `string` | Operation-specific; see exact types |  |
| `source` | `string` | Operation-specific; see exact types |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Returns an array.

```ts
const results = await client.WorkoutLog().list()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `WorkoutLogEntity` instance with the same client and
options.

#### `client()`

Return the parent `TallySDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `test` | 0.0.1 | Test transport |


Features are activated via the `feature` option:

```ts
const client = new TallySDK({
  feature: {
    test: { active: true },
  }
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

