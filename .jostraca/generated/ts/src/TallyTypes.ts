// Typed models for the Tally SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Feed {
  date?: string
  items?: any[]
  relative_label?: string
}

export interface FeedListMatch {
  before?: string
}

export interface FoodEntry {
  caffeine_mg?: number
  calories?: number
  carbs_g?: number
  confirmed?: boolean
  date?: string
  entry?: Record<string, any>
  fat_g?: number
  id?: number
  input: string
  logged_on?: string
  meal_type?: string
  name?: string
  protein_g?: number
}

export interface FoodEntryListMatch {
  date?: string
}

export interface FoodEntryCreateData {
  caffeine_mg?: number
  calories?: number
  carbs_g?: number
  confirmed?: boolean
  date?: string
  entry?: Record<string, any>
  fat_g?: number
  id?: number
  input: string
  logged_on?: string
  meal_type?: string
  name?: string
  protein_g?: number

  // Selects a custom action instead of the plain create:
  //   'parse'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface FoodEntryUpdateData {
  id: number
  caffeine_mg?: number
  calories?: number
  carbs_g?: number
  confirmed?: boolean
  date?: string
  entry?: Record<string, any>
  fat_g?: number
  input?: string
  logged_on?: string
  meal_type?: string
  name?: string
  protein_g?: number
}

export interface FoodEntryRemoveMatch {
  id: number
}

export interface MoodEntry {
  body: string
  id?: number
  logged_at?: string
  time_label?: string
}

export interface MoodEntryListMatch {
  date?: string
}

export interface MoodEntryCreateData {
  body: string
  id?: number
  logged_at?: string
  time_label?: string
}

export interface MoodEntryRemoveMatch {
  id: number
}

export interface SleepLog {
  awake_seconds?: number
  date?: string
  deep_sleep_seconds?: number
  duration_label?: string
  ended_at?: string
  id?: number
  light_sleep_seconds?: number
  rem_sleep_seconds?: number
  sleep_score?: number
  source?: string
  started_at?: string
  total_sleep_seconds?: number
}

export interface SleepLogListMatch {
  date?: string
}

export interface WorkoutLog {
  activity_type?: string
  calories?: number
  distance_m?: number
  distance_miles?: number
  duration_label?: string
  id?: number
  logged_on?: string
  moving_time_s?: number
  name?: string
  occurred_at?: string
  source?: string
}

export interface WorkoutLogListMatch {
  date?: string
}

