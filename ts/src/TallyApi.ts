// Generated full-response companion API. Existing entity methods remain available.
import type { TallySDK } from './TallySDK'
import type * as Api from './TallyApiTypes'
import { schemas } from './TallyApiSchemas'
import { TallyApiError, validateRequest, validateResponse } from './ApiValidation'

interface Request {
  method: string
  path: string
  query?: object
  body?: unknown
}

interface Response {
  data: unknown
  status: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export class TallyApi {
  constructor(private readonly client: TallySDK) {}

  private async request(operation: string, args: Request): Promise<Response> {
    let result: unknown
    try {
      // Keep the generated transport, authentication, custom fetch, base URL,
      // and direct-operation permission gate. Never fetch around those gates.
      result = await this.client.direct(args)
    }
    catch (cause: unknown) {
      throw new TallyApiError('transport', operation, 'The request could not be completed', undefined, undefined, cause)
    }
    if (result instanceof Error) {
      throw new TallyApiError('transport', operation, 'The request could not be prepared', undefined, undefined, result)
    }
    if (!isRecord(result)) {
      throw new TallyApiError('transport', operation, 'The transport did not return a response')
    }
    const status = typeof result.status === 'number' ? result.status : undefined
    if (result.ok !== true) {
      if (status !== undefined) {
        throw new TallyApiError('http', operation, 'The API returned HTTP ' + status, status, result.data, result.err)
      }
      throw new TallyApiError('transport', operation, 'The request could not be completed', undefined, result.data, result.err)
    }
    if (status === undefined) {
      throw new TallyApiError('transport', operation, 'The transport response has no HTTP status')
    }
    return { data: result.data, status }
  }

  async listFoodEntries(query: Api.ListFoodEntriesQuery = {}): Promise<Api.ListFoodEntriesResponse> {
    validateRequest(query, schemas.ListFoodEntriesQuery, 'listFoodEntries', 'query')
    const response = await this.request('listFoodEntries', { method: 'GET', path: "/food_entries", query: { "date": query["date"] } })
    validateResponse<Api.ListFoodEntriesResponse>(response.data, schemas.ListFoodEntriesResponse, 'listFoodEntries', response.status)
    return response.data
  }

  async createFoodEntries(body: Api.CreateFoodEntriesBody): Promise<Api.CreateFoodEntriesResponse> {
    validateRequest(body, schemas.CreateFoodEntriesBody, 'createFoodEntries', 'body')
    const response = await this.request('createFoodEntries', { method: 'POST', path: "/food_entries", body })
    validateResponse<Api.CreateFoodEntriesResponse>(response.data, schemas.CreateFoodEntriesResponse, 'createFoodEntries', response.status)
    return response.data
  }

  async parseFoodEntries(body: Api.ParseFoodEntriesBody): Promise<Api.ParseFoodEntriesResponse> {
    validateRequest(body, schemas.ParseFoodEntriesBody, 'parseFoodEntries', 'body')
    const response = await this.request('parseFoodEntries', { method: 'POST', path: "/food_entries/parse", body })
    validateResponse<Api.ParseFoodEntriesResponse>(response.data, schemas.ParseFoodEntriesResponse, 'parseFoodEntries', response.status)
    return response.data
  }

  async updateFoodEntry(id: number, body: Api.UpdateFoodEntryBody): Promise<Api.UpdateFoodEntryResponse> {
    validateRequest(id, schemas.UpdateFoodEntryId, 'updateFoodEntry', 'id')
    validateRequest(body, schemas.UpdateFoodEntryBody, 'updateFoodEntry', 'body')
    const response = await this.request('updateFoodEntry', { method: 'PATCH', path: `/food_entries/${encodeURIComponent(String(id))}`, body })
    validateResponse<Api.UpdateFoodEntryResponse>(response.data, schemas.UpdateFoodEntryResponse, 'updateFoodEntry', response.status)
    return response.data
  }

  async deleteFoodEntry(id: number): Promise<Api.DeleteFoodEntryResponse> {
    validateRequest(id, schemas.DeleteFoodEntryId, 'deleteFoodEntry', 'id')
    const response = await this.request('deleteFoodEntry', { method: 'DELETE', path: `/food_entries/${encodeURIComponent(String(id))}` })
    validateResponse<Api.DeleteFoodEntryResponse>(response.data, schemas.DeleteFoodEntryResponse, 'deleteFoodEntry', response.status)
    return response.data
  }

  async listMoodEntries(query: Api.ListMoodEntriesQuery = {}): Promise<Api.ListMoodEntriesResponse> {
    validateRequest(query, schemas.ListMoodEntriesQuery, 'listMoodEntries', 'query')
    const response = await this.request('listMoodEntries', { method: 'GET', path: "/mood_entries", query: { "date": query["date"] } })
    validateResponse<Api.ListMoodEntriesResponse>(response.data, schemas.ListMoodEntriesResponse, 'listMoodEntries', response.status)
    return response.data
  }

  async createMoodEntry(body: Api.CreateMoodEntryBody): Promise<Api.CreateMoodEntryResponse> {
    validateRequest(body, schemas.CreateMoodEntryBody, 'createMoodEntry', 'body')
    const response = await this.request('createMoodEntry', { method: 'POST', path: "/mood_entries", body })
    validateResponse<Api.CreateMoodEntryResponse>(response.data, schemas.CreateMoodEntryResponse, 'createMoodEntry', response.status)
    return response.data
  }

  async deleteMoodEntry(id: number): Promise<Api.DeleteMoodEntryResponse> {
    validateRequest(id, schemas.DeleteMoodEntryId, 'deleteMoodEntry', 'id')
    const response = await this.request('deleteMoodEntry', { method: 'DELETE', path: `/mood_entries/${encodeURIComponent(String(id))}` })
    validateResponse<Api.DeleteMoodEntryResponse>(response.data, schemas.DeleteMoodEntryResponse, 'deleteMoodEntry', response.status)
    return response.data
  }

  async listWorkoutLogs(query: Api.ListWorkoutLogsQuery = {}): Promise<Api.ListWorkoutLogsResponse> {
    validateRequest(query, schemas.ListWorkoutLogsQuery, 'listWorkoutLogs', 'query')
    const response = await this.request('listWorkoutLogs', { method: 'GET', path: "/workout_logs", query: { "date": query["date"] } })
    validateResponse<Api.ListWorkoutLogsResponse>(response.data, schemas.ListWorkoutLogsResponse, 'listWorkoutLogs', response.status)
    return response.data
  }

  async listSleepLogs(query: Api.ListSleepLogsQuery = {}): Promise<Api.ListSleepLogsResponse> {
    validateRequest(query, schemas.ListSleepLogsQuery, 'listSleepLogs', 'query')
    const response = await this.request('listSleepLogs', { method: 'GET', path: "/sleep_logs", query: { "date": query["date"] } })
    validateResponse<Api.ListSleepLogsResponse>(response.data, schemas.ListSleepLogsResponse, 'listSleepLogs', response.status)
    return response.data
  }

  async getFeed(query: Api.GetFeedQuery = {}): Promise<Api.GetFeedResponse> {
    validateRequest(query, schemas.GetFeedQuery, 'getFeed', 'query')
    const response = await this.request('getFeed', { method: 'GET', path: "/feed", query: { "before": query["before"] } })
    validateResponse<Api.GetFeedResponse>(response.data, schemas.GetFeedResponse, 'getFeed', response.status)
    return response.data
  }
}

export { TallyApiError }
