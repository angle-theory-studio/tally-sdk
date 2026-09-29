// Compile-only contract checks. Run with TypeScript strict/noEmit.
import {
  TallySDK, TallyApiError,
  type FoodEntry, type MealType, type FeedItem,
  type FoodEntryCreateData, type FoodEntryUpdateData,
  type ListFoodEntriesResponse, type CreateFoodEntriesResponse,
  type ParseFoodEntriesResponse, type UpdateFoodEntryResponse,
  type DeleteFoodEntryResponse, type ListMoodEntriesResponse,
  type CreateMoodEntryResponse, type DeleteMoodEntryResponse,
  type ListWorkoutLogsResponse, type ListSleepLogsResponse, type GetFeedResponse,
} from '../ts/dist/TallySDK'

// Compile tests only; never call this function or make a network request.
async function usage(sdk: TallySDK) {
  const list: ListFoodEntriesResponse = await sdk.api.listFoodEntries({ date: '2026-06-03' })
  const create: CreateFoodEntriesResponse = await sdk.api.createFoodEntries({ input: 'eggs', meal_type: 'breakfast', date: '2026-06-03' })
  const preview: ParseFoodEntriesResponse = await sdk.api.parseFoodEntries({ input: 'eggs', meal_type: 'breakfast' })
  const update: UpdateFoodEntryResponse = await sdk.api.updateFoodEntry(1, { entry: { protein_g: 12.5, meal_type: 'lunch' } })
  const deleted: DeleteFoodEntryResponse = await sdk.api.deleteFoodEntry(1)
  const moods: ListMoodEntriesResponse = await sdk.api.listMoodEntries()
  const mood: CreateMoodEntryResponse = await sdk.api.createMoodEntry({ body: 'Good', logged_at: '2026-06-03T09:30:00Z' })
  const removedMood: DeleteMoodEntryResponse = await sdk.api.deleteMoodEntry(2)
  const workouts: ListWorkoutLogsResponse = await sdk.api.listWorkoutLogs()
  const sleep: ListSleepLogsResponse = await sdk.api.listSleepLogs({ date: '2026-06-03' })
  const feed: GetFeedResponse = await sdk.api.getFeed()
  const older: GetFeedResponse = await sdk.api.getFeed({ before: feed.older_before })

  const calories: number | undefined = list.totals?.calories
  const goals: number | undefined = list.goals?.calories
  const ids: Array<number | undefined> | undefined = create.entries?.map(entry => entry.id)
  const raw: string | undefined = preview.raw_input
  const proteins: number | undefined = update.protein_g
  const remaining: number | undefined = deleted.remaining?.protein_g
  const moodBody: string | undefined = moods.entries?.[0]?.body
  const timestamp: string | undefined = mood.logged_at
  const message: string | undefined = removedMood.message
  const distance: number | null | undefined = workouts.workouts?.[0]?.distance_m
  const seconds: number | null | undefined = sleep.sleep_logs?.[0]?.total_sleep_seconds
  const kind: FeedItem['type'] | undefined = older.days?.[0]?.items?.[0]?.type
  void [calories, goals, ids, raw, proteins, remaining, moodBody, timestamp, message, distance, seconds, kind]

  // The wire response has no create-request `input` requirement.
  const record: FoodEntry = { id: 1, name: 'Eggs', meal_type: 'breakfast' }
  const absentOptionalProps: FoodEntry = {}
  const nullableGoals: ListFoodEntriesResponse = { goals: null }
  const nullableSleep: ListSleepLogsResponse = { sleep_logs: [{ started_at: null, sleep_score: null }] }
  const legacyCreate: FoodEntryCreateData = { input: 'eggs', $action: 'parse' }
  const legacyUpdate: FoodEntryUpdateData = { id: 1, entry: { calories: 180 } }
  void [record, absentOptionalProps, nullableGoals, nullableSleep, legacyCreate, legacyUpdate]

  // @ts-expect-error create requires input; response objects are not requests
  sdk.api.createFoodEntries({ name: 'Eggs' })
  // @ts-expect-error the API enum is not an arbitrary string
  sdk.api.createFoodEntries({ input: 'eggs', meal_type: 'brunch' })
  // @ts-expect-error preview request does not support date
  sdk.api.parseFoodEntries({ input: 'eggs', date: '2026-06-03' })
  // @ts-expect-error PATCH fields must be nested in entry
  sdk.api.updateFoodEntry(1, { name: 'Eggs' })
  // @ts-expect-error id is an integer path parameter, not a string
  sdk.api.deleteFoodEntry('1')
  // @ts-expect-error feed query is before, not date
  sdk.api.getFeed({ date: '2026-06-03' })
  // @ts-expect-error logging a mood requires body
  sdk.api.createMoodEntry({ logged_at: '2026-06-03T09:30:00Z' })
  // @ts-expect-error numeric nullable values remain numbers, never strings
  const invalidSleep: ListSleepLogsResponse = { sleep_logs: [{ total_sleep_seconds: '8 hours' }] }
  // @ts-expect-error only the feed item requires these response properties
  const invalidFeedItem: FeedItem = { type: 'mood', id: 1 }
  // @ts-expect-error output FoodEntry has no input field
  const invalidRecord: FoodEntry = { input: 'eggs' }
  // @ts-expect-error nullable fields cannot be assumed non-null
  const nonNullable: number = workouts.workouts![0].calories
  // @ts-expect-error MealType is a closed enum
  const invalidMeal: MealType = 'anything'
  // @ts-expect-error legacy type reflects nested PATCH body too
  const invalidLegacyUpdate: FoodEntryUpdateData = { id: 1, calories: 4 }
  void [invalidSleep, invalidFeedItem, invalidRecord, nonNullable, invalidMeal, invalidLegacyUpdate]
}

function handleError(error: unknown) {
  if (error instanceof TallyApiError) {
    const code: 'request_validation' | 'transport' | 'http' | 'response_validation' = error.code
    const status: number | undefined = error.status
    const payload: unknown = error.response
    void [code, status, payload]
  }
}
void [usage, handleError]
