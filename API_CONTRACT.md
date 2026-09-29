# Tally API contract

This document records the contract used to implement and review the SDK's typed API. It defines acceptance criteria; it is not a report that the checks passed or that the live service was tested.

## Source and scope

- Committed source: [`.sdk/def/openapi.yaml`](.sdk/def/openapi.yaml), OpenAPI 3.1.0, API version `1`.
- Official source: [https://www.logwithtally.com/api.yaml](https://www.logwithtally.com/api.yaml).
- Retrieved on **29 September 2026**: HTTP 200, **21,979 bytes**, identical to the committed source.
- SHA-256: `43fc405ac50db3e90ecd245f6bf9d7d449717bf27d47450a9a8dc0f9e7e7d51b`.
- Scope: **8 paths and 11 HTTP operations** under `https://www.logwithtally.com/api/v1`.

All operations require `Authorization: Bearer <token>`. POST and PATCH bodies use JSON. GET and DELETE operations have no request body in the specification. Path IDs are required integers and must not also be added to the query string.

## Operation matrix

`R` means required; `O` means optional. Response shapes below list available properties, not required properties: the upstream specification makes them optional unless noted in the schema caveats. Schema names refer to definitions in the committed source.

| Operation | Request fields | Success response | Documented statuses | Acceptance criterion |
| --- | --- | --- | --- | --- |
| GET `/food_entries` | O query `date` | `{date, entries: FoodEntry[], totals: DailyTotals, remaining: DailyRemaining, goals: DailyGoals}` | 200, 401 | Preserve entries and all metadata, including empty lists, zero totals, negative remaining values and nullable goals. |
| POST `/food_entries` | R JSON `input: string`; O `meal_type`, `date` | `{entries: FoodEntry[], totals: DailyTotals, remaining: DailyRemaining}` | 201, 401, 422 | Preserve multiple returned entries and both totals objects. Do not require the request's `input` field on a returned entry. |
| POST `/food_entries/parse` | R JSON `input: string`; O `meal_type` | `{raw_input, meal_type, parsed: ParsedEntry[]}` | 200, 401, 422 | Use the exact preview path and retain the preview envelope. Do not route this operation to the food-creation endpoint. |
| PATCH `/food_entries/{id}` | R path `id`; R JSON body; O `entry` and its properties | `FoodEntry` | 200, 401, 422 | Preserve the `{entry: {...}}` body structure. Send the ID only in the path and return the flat entry response. |
| DELETE `/food_entries/{id}` | R path `id` | `{message, totals: DailyTotals, remaining: DailyRemaining}` | 200, 401 | Send no body or redundant ID query. Preserve the deletion message and updated totals. |
| GET `/mood_entries` | O query `date` | `{entries: MoodEntry[]}` | 200, 401 | Preserve the response envelope, every entry and an empty list. |
| POST `/mood_entries` | R JSON `body: string`; O `logged_at` | `MoodEntry` | 201, 401, 422 | Send the text in the top-level JSON property named `body`; leave an absent timestamp out of the request. |
| DELETE `/mood_entries/{id}` | R path `id` | `{message}` | 200, 401 | Send no body or redundant ID query and retain the returned message. |
| GET `/workout_logs` | O query `date` | `{date, workouts: WorkoutLog[]}` | 200, 401 | Preserve the date, every workout and explicit null values. |
| GET `/sleep_logs` | O query `date` | `{date, sleep_logs: SleepLog[]}` | 200, 401 | Preserve the date, all sleep sessions including naps, explicit nulls and server order. |
| GET `/feed` | O query `before` | `{days: FeedDay[], older_before}` | 200, 401 | Preserve the complete page, especially `older_before`, and support passing that cursor as the next request's `before`. |

Date query fields and the food-create `date` field are strings with `date` format. `logged_at` has `date-time` format. The parse request does not declare a `date` property. Optional fields must be omitted when absent, rather than serialized as the text `undefined`.

The food-update `entry` object declares `name`, `calories`, `protein_g`, `carbs_g`, `fat_g`, `caffeine_mg` and `meal_type`. **The request body is required, but neither `entry` nor any of its properties is declared required.** The SDK must not claim stricter requirements came from the specification.

## Response fidelity and schema caveats

The typed API must retain the complete response body. Extracting a list must not make totals, dates, messages or pagination metadata inaccessible. Response types must follow response schemas independently of request schemas.

- **Optional properties:** all response-object properties are optional except the three required `FeedItem` properties: `type`, `id` and `time_label`. In particular, `FoodEntry` has no `input` property, and `ParsedEntry` has neither `id` nor `input`.
- **Enums:** `MealType` is `breakfast`, `lunch`, `dinner` or `snack`. `FeedItem.type` is `food`, `mood`, `weight` or `workout`. The schema does not require additional fields for any one feed-item type.
- **Nullability:** the source uses `nullable: true` despite declaring OpenAPI 3.1. Preserve its stated nullability in generated types and returned data; an optional property and a nullable value are different cases.
- **Goals and totals:** `DailyGoals` is nullable as a whole. `DailyRemaining` values may be negative. Calories, caffeine and entry counts are integers where declared; protein, carbohydrates and fat are numbers. Zero values must survive unchanged.
- **Workout values:** `calories`, `distance_m`, `distance_miles`, `moving_time_s` and `duration_label` are nullable. `WorkoutLog.distance_m` is an integer, whereas `FeedItem.distance_m` is a number. A feed item's `distance_m`, `moving_time_s` and `source` are nullable; `WorkoutLog.source` is not declared nullable.
- **Sleep values:** `started_at`, `ended_at`, `total_sleep_seconds`, `deep_sleep_seconds`, `light_sleep_seconds`, `rem_sleep_seconds`, `awake_seconds`, `sleep_score` and `duration_label` are nullable. The endpoint describes sessions ordered longest first; the client must not discard sessions or reorder the response.
- **No invented bounds:** the source does not declare positive-only IDs, string `minLength`, `maxItems: 14`, `uniqueItems` or `additionalProperties: false`. Do not present these as upstream constraints.

## Feed pagination

The feed covers 14 calendar days per page, ending on and including `before` when supplied; it defaults to today. `days` contains days with activity, newest first. Each day's `items` is also newest first. Preserve this ordering.

To request the previous page, pass the returned `older_before` as `before`. Keep that cursor available to callers even when `days` is empty; an empty array alone does not prove pagination has ended. The cursor is optional in the schema but is not declared nullable. Automatic traversal, if offered, must stop safely when no usable cursor is available and must not loop on a repeated cursor.

The general [Developers page](https://www.logwithtally.com/developers) describes `date` for all GET endpoints, but this operation's specification declares **`before`**. This contract follows the operation-specific specification.

## Errors and acceptance coverage

Every operation documents a 401 response with `{error?: string}`. Food creation, food parsing, food update and mood creation additionally document 422 with `{error?: string, errors?: string[]}`. SDK errors must retain the status and error body; authentication or validation failures must not become successful empty results. Other HTTP failures still need clear handling, but their semantics are not defined by this upstream specification.

The executable acceptance checks belong in [`checks/api-contract.test.cjs`](checks/api-contract.test.cjs). After building the TypeScript target, run from the repository root:

```sh
node --test checks/api-contract.test.cjs
```

Acceptance requires checking all 11 operations against fixtures derived from the documented response schemas, independently of the generator's internal mock model. Check exact method, URL, path substitution, query omission, Bearer header, JSON body and full returned response. Include empty collections, nulls, zero/negative values, 401/422 errors and feed cursor propagation. Type checks must distinguish request inputs from response objects and preserve optional, nullable and enum declarations.

These are coverage requirements, not a statement of test results. See [AUDIT.md](AUDIT.md) for verification evidence and its scope. No authenticated live API request was performed in preparing this contract. In particular, an offline test can check that parsing uses the documented non-persisting route; it cannot establish the live service's persistence behavior, access entitlement or complete compatibility.
