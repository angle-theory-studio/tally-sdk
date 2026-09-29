import { cmp, Content } from '@voxgig/sdkgen'

const ReadmeIntro = cmp(function ReadmeIntro(_props: { target?: unknown }) {
  Content(`# Tally TypeScript SDK

Unofficial TypeScript SDK for the [Tally nutrition tracker](https://www.logwithtally.com), generated with Voxgig SDK tools.

## Recommended API

Use \`client.api\` for all 11 documented HTTP operations. Each method returns
its complete, typed JSON response and checks the declared response schema.
Food entries retain daily totals, remaining macros and goals; feed responses
retain \`older_before\` for pagination. Create and preview are separate methods.

| Method | HTTP endpoint | Response |
| --- | --- | --- |
| \`listFoodEntries({ date? })\` | GET /food_entries | Entries, totals, remaining macros, goals and date |
| \`createFoodEntries({ input, meal_type?, date? })\` | POST /food_entries | All created entries, totals and remaining macros |
| \`parseFoodEntries({ input, meal_type? })\` | POST /food_entries/parse | Preview with raw input, meal type and parsed entries |
| \`updateFoodEntry(id, { entry? })\` | PATCH /food_entries/{id} | Updated food entry |
| \`deleteFoodEntry(id)\` | DELETE /food_entries/{id} | Message, totals and remaining macros |
| \`listMoodEntries({ date? })\` | GET /mood_entries | Entries envelope |
| \`createMoodEntry({ body, logged_at? })\` | POST /mood_entries | Created mood entry |
| \`deleteMoodEntry(id)\` | DELETE /mood_entries/{id} | Message envelope |
| \`listWorkoutLogs({ date? })\` | GET /workout_logs | Date and workouts envelope |
| \`listSleepLogs({ date? })\` | GET /sleep_logs | Date and sleep sessions envelope |
| \`getFeed({ before? })\` | GET /feed | Days and pagination cursor |

The query object is optional on GET methods. Response properties remain
optional or nullable exactly where declared by the source specification.
Invalid requests, transport failures, non-2xx HTTP responses and invalid
response shapes reject with \`TallyApiError\`.

See the [API contract](https://github.com/angle-theory-studio/tally-sdk/blob/main/API_CONTRACT.md),
[generated exact types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts),
and [project README](https://github.com/angle-theory-studio/tally-sdk/blob/main/README.md).

The capitalised entity interface, such as \`client.FoodEntry()\`, remains
available. Its list methods return entity arrays and do not retain surrounding
response metadata. Legacy create/parse/remove entity data can hold response
envelopes; prefer \`client.api\` for operation-specific return types.

`)
})

export { ReadmeIntro }
