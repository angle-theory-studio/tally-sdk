# Tally API

Tally is a personal nutrition and weight tracker. Log food in plain English, track your weight, and hit your macro goals. **Base URL:** https://www.logwithtally.com/api/v1 ## Authentication All endpoints require a Bearer token in the `Authorization` header: ``` Authorization: Bearer &lt;api_token&gt; ``` Find your API token in Tally under Settings.

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 5 entities and 11 HTTP routes. There are 1 SDK targets.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Feed

Results: Feed days.

SDK operations: `list`.

Key fields to recognise:

- `relative_label`: &quot;Today&quot;, &quot;Yesterday&quot;, or the weekday name

### FoodEntry

Results: Entries created; Parse preview; Entries, daily totals, remaining macros, and goals; Entry removed; updated totals returned; Updated entry.

SDK operations: `create`, `list`, `remove`, `update`.

Key fields to recognise:

- `date`: Date to log against (YYYY-MM-DD).
- `input`: Natural-language food description, for example

### MoodEntry

Results: Entry created; Mood entries for the day; Entry removed.

SDK operations: `create`, `list`, `remove`.

Key fields to recognise:

- `logged_at`: ISO 8601 timestamp.
- `time_label`: Human-readable local time

### SleepLog

Results: Sleep logs for the day.

SDK operations: `list`.

Key fields to recognise:

- `duration_label`: Human-friendly duration, for example &quot;7h 0m&quot;

### WorkoutLog

Results: Workouts for the day.

SDK operations: `list`.

Key fields to recognise:

- `distance_m`: Distance in metres
- `distance_miles`: Distance in miles (rounded to 1 decimal)
- `duration_label`: Human-friendly duration, for example &quot;44m&quot; or &quot;1h 4m&quot;
- `moving_time_s`: Moving time in seconds

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Feed | `list` | `GET /feed` | Required |
| FoodEntry | `create` | `POST /food_entries` | Required |
| FoodEntry | `create` | `POST /food_entries/parse` | Required |
| FoodEntry | `list` | `GET /food_entries` | Required |
| FoodEntry | `remove` | `DELETE /food_entries/{id}` | Required |
| FoodEntry | `update` | `PATCH /food_entries/{id}` | Required |
| MoodEntry | `create` | `POST /mood_entries` | Required |
| MoodEntry | `list` | `GET /mood_entries` | Required |
| MoodEntry | `remove` | `DELETE /mood_entries/{id}` | Required |
| SleepLog | `list` | `GET /sleep_logs` | Required |
| WorkoutLog | `list` | `GET /workout_logs` | Required |

## Connect to the API

- API server: `https://www.logwithtally.com/api/v1`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

API token from Tally Settings

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `test`: In-memory mock transport for testing without a live server

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

