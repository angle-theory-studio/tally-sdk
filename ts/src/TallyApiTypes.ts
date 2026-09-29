// Generated from .sdk/def/openapi.yaml. Optional and nullable fields follow the source specification.

export type MealType = "breakfast" | "lunch" | "dinner" | "snack"

export type User = {
  "id"?: number;
  "email"?: string;
  "name"?: (string) | null;
  "time_zone"?: string;
  "goal_calories"?: (number) | null;
  "goal_protein_g"?: (number) | null;
  "goal_carbs_g"?: (number) | null;
  "goal_fat_g"?: (number) | null;
}

export type FoodEntry = {
  "id"?: number;
  "name"?: string;
  "meal_type"?: MealType;
  "logged_on"?: string;
  "calories"?: number;
  "protein_g"?: number;
  "carbs_g"?: number;
  "fat_g"?: number;
  "caffeine_mg"?: number;
  "confirmed"?: boolean;
}

export type ParsedEntry = {
  "name"?: string;
  "calories"?: number;
  "protein_g"?: number;
  "carbs_g"?: number;
  "fat_g"?: number;
  "caffeine_mg"?: number;
}

export type FoodEntryCreateBody = {
  "input": string;
  "meal_type"?: MealType;
  "date"?: string;
}

export type DailyTotals = {
  "calories"?: number;
  "protein_g"?: number;
  "carbs_g"?: number;
  "fat_g"?: number;
  "caffeine_mg"?: number;
  "entry_count"?: number;
}

export type DailyRemaining = {
  "calories"?: number;
  "protein_g"?: number;
  "carbs_g"?: number;
  "fat_g"?: number;
}

export type DailyGoals = ({
  "calories"?: number;
  "protein_g"?: number;
  "carbs_g"?: number;
  "fat_g"?: number;
}) | null

export type FoodEntriesResponse = {
  "date"?: string;
  "entries"?: Array<FoodEntry>;
  "totals"?: DailyTotals;
  "remaining"?: DailyRemaining;
  "goals"?: DailyGoals;
}

export type MoodEntry = {
  "id"?: number;
  "body"?: string;
  "logged_at"?: string;
  "time_label"?: string;
}

export type FeedItem = {
  "type": "food" | "mood" | "weight" | "workout";
  "id": number;
  "time_label": string;
  "meal_type"?: MealType;
  "name"?: string;
  "calories"?: number;
  "protein_g"?: number;
  "carbs_g"?: number;
  "fat_g"?: number;
  "body"?: string;
  "weight_lbs"?: number;
  "distance_m"?: (number) | null;
  "moving_time_s"?: (number) | null;
  "source"?: (string) | null;
}

export type FeedDay = {
  "date"?: string;
  "relative_label"?: string;
  "items"?: Array<FeedItem>;
}

export type WorkoutLog = {
  "id"?: number;
  "name"?: string;
  "activity_type"?: string;
  "source"?: string;
  "calories"?: (number) | null;
  "distance_m"?: (number) | null;
  "distance_miles"?: (number) | null;
  "moving_time_s"?: (number) | null;
  "duration_label"?: (string) | null;
  "occurred_at"?: string;
  "logged_on"?: string;
}

export type SleepLog = {
  "id"?: number;
  "date"?: string;
  "source"?: string;
  "started_at"?: (string) | null;
  "ended_at"?: (string) | null;
  "total_sleep_seconds"?: (number) | null;
  "deep_sleep_seconds"?: (number) | null;
  "light_sleep_seconds"?: (number) | null;
  "rem_sleep_seconds"?: (number) | null;
  "awake_seconds"?: (number) | null;
  "sleep_score"?: (number) | null;
  "duration_label"?: (string) | null;
}

export type FeedResponse = {
  "days"?: Array<FeedDay>;
  "older_before"?: string;
}

export type ListFoodEntriesQuery = {
  "date"?: string;
}

export type ListFoodEntriesResponse = FoodEntriesResponse

export type CreateFoodEntriesBody = FoodEntryCreateBody

export type CreateFoodEntriesResponse = {
  "entries"?: Array<FoodEntry>;
  "totals"?: DailyTotals;
  "remaining"?: DailyRemaining;
}

export type ParseFoodEntriesBody = {
  "input": string;
  "meal_type"?: MealType;
}

export type ParseFoodEntriesResponse = {
  "raw_input"?: string;
  "meal_type"?: MealType;
  "parsed"?: Array<ParsedEntry>;
}

export type UpdateFoodEntryBody = {
  "entry"?: {
  "name"?: string;
  "calories"?: number;
  "protein_g"?: number;
  "carbs_g"?: number;
  "fat_g"?: number;
  "caffeine_mg"?: number;
  "meal_type"?: MealType;
};
}

export type UpdateFoodEntryResponse = FoodEntry

export type DeleteFoodEntryResponse = {
  "message"?: string;
  "totals"?: DailyTotals;
  "remaining"?: DailyRemaining;
}

export type ListMoodEntriesQuery = {
  "date"?: string;
}

export type ListMoodEntriesResponse = {
  "entries"?: Array<MoodEntry>;
}

export type CreateMoodEntryBody = {
  "body": string;
  "logged_at"?: string;
}

export type CreateMoodEntryResponse = MoodEntry

export type DeleteMoodEntryResponse = {
  "message"?: string;
}

export type ListWorkoutLogsQuery = {
  "date"?: string;
}

export type ListWorkoutLogsResponse = {
  "date"?: string;
  "workouts"?: Array<WorkoutLog>;
}

export type ListSleepLogsQuery = {
  "date"?: string;
}

export type ListSleepLogsResponse = {
  "date"?: string;
  "sleep_logs"?: Array<SleepLog>;
}

export type GetFeedQuery = {
  "before"?: string;
}

export type GetFeedResponse = FeedResponse
