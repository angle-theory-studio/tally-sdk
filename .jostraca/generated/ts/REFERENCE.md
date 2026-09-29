# Tally TypeScript SDK Reference

Complete API reference for the Tally TypeScript SDK.


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

#### `Feed(data?: object)`

Create a new `Feed` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `FeedEntity` instance.

#### `FoodEntry(data?: object)`

Create a new `FoodEntry` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `FoodEntryEntity` instance.

#### `MoodEntry(data?: object)`

Create a new `MoodEntry` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `MoodEntryEntity` instance.

#### `SleepLog(data?: object)`

Create a new `SleepLog` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `SleepLogEntity` instance.

#### `WorkoutLog(data?: object)`

Create a new `WorkoutLog` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

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

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `date` | `string` | No |  |
| `items` | `any[]` | No |  |
| `relative_label` | `string` | No | "Today", "Yesterday", or the weekday name |

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

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `caffeine_mg` | `number` | No |  |
| `calories` | `number` | No |  |
| `carbs_g` | `number` | No |  |
| `confirmed` | `boolean` | No |  |
| `date` | `string` | No | Date to log against (YYYY-MM-DD). |
| `entry` | `Record<string, any>` | No |  |
| `fat_g` | `number` | No |  |
| `id` | `number` | No |  |
| `input` | `string` | Yes | Natural-language food description, e.g. |
| `logged_on` | `string` | No |  |
| `meal_type` | `string` | No |  |
| `name` | `string` | No |  |
| `protein_g` | `number` | No |  |

### Actions

This entity exposes custom API actions in addition to the standard
operations. Select one with `$action` in the call's argument; the
remaining keys are sent as that action's payload.

| Action | Route | Call |
| --- | --- | --- |
| `parse` | `/food_entries/parse` | `client.FoodEntry().create({ $action: 'parse', ... })` |

An action returns that action's OWN response, which is not necessarily a
FoodEntry record — check the API definition for its shape.

```ts
const result = await client.FoodEntry().create({
  $action: 'parse',
  /* ...the action's own arguments */
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

Remove the entity matching the given criteria.

```ts
const result = await client.FoodEntry().remove({ id: 1 })
```

#### `update(data: object, ctrl?: object)`

Update an existing entity. The data must include the entity `id`.

```ts
const result = await client.FoodEntry().update({
  id: 1,
  // Fields to update
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

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `string` | Yes |  |
| `id` | `number` | No |  |
| `logged_at` | `string` | No | ISO 8601 timestamp. |
| `time_label` | `string` | No | Human-readable local time |

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

Remove the entity matching the given criteria.

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

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `awake_seconds` | `number` | No |  |
| `date` | `string` | No |  |
| `deep_sleep_seconds` | `number` | No |  |
| `duration_label` | `string` | No | Human-friendly duration, e.g. |
| `ended_at` | `string` | No |  |
| `id` | `number` | No |  |
| `light_sleep_seconds` | `number` | No |  |
| `rem_sleep_seconds` | `number` | No |  |
| `sleep_score` | `number` | No |  |
| `source` | `string` | No |  |
| `started_at` | `string` | No |  |
| `total_sleep_seconds` | `number` | No |  |

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

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `activity_type` | `string` | No |  |
| `calories` | `number` | No |  |
| `distance_m` | `number` | No | Distance in metres |
| `distance_miles` | `number` | No | Distance in miles (rounded to 1 decimal) |
| `duration_label` | `string` | No | Human-friendly duration, e.g. |
| `id` | `number` | No |  |
| `logged_on` | `string` | No |  |
| `moving_time_s` | `number` | No | Moving time in seconds |
| `name` | `string` | No |  |
| `occurred_at` | `string` | No |  |
| `source` | `string` | No |  |

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

