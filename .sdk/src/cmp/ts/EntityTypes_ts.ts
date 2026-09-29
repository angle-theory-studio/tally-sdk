import { cmp, File, Content } from '@voxgig/sdkgen'

// The inferred entity fields combine request and response properties. The source
// OpenAPI contract separates them, so legacy signatures reference the same exact
// aliases used by the typed companion API instead of the inferred field union.
const EntityTypes = cmp(function EntityTypes() {
  File({ name: 'TallyTypes.ts' }, () => Content(`// Generated legacy entity aliases. Prefer sdk.api for complete typed responses.
import type * as Api from './TallyApiTypes'
export type * from './TallyApiTypes'

export type Feed = Api.FeedDay
export type FeedListMatch = Api.GetFeedQuery
export type FoodEntryListMatch = Api.ListFoodEntriesQuery
export type FoodEntryCreateData =
  | (Api.CreateFoodEntriesBody & { $action?: undefined })
  | (Api.ParseFoodEntriesBody & { $action: 'parse' })
export type FoodEntryUpdateData = Api.UpdateFoodEntryBody & { id: number }
export type FoodEntryRemoveMatch = { id: number }

/** Legacy FoodEntry instances hold different response shapes after create,
 * parse, update and remove. sdk.api returns each operation's specific shape.
 */
export type FoodEntryData = Api.FoodEntry | Api.CreateFoodEntriesResponse |
  Api.ParseFoodEntriesResponse | Api.DeleteFoodEntryResponse

export type MoodEntryListMatch = Api.ListMoodEntriesQuery
export type MoodEntryCreateData = Api.CreateMoodEntryBody
export type MoodEntryRemoveMatch = { id: number }
export type MoodEntryData = Api.MoodEntry | Api.DeleteMoodEntryResponse
export type SleepLogListMatch = Api.ListSleepLogsQuery
export type WorkoutLogListMatch = Api.ListWorkoutLogsQuery
`))
})

export { EntityTypes }
