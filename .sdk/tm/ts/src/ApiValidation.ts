/** Validation of JSON types, required properties and enums declared in OpenAPI.
 * Date/time formats are documented strings, not additional runtime restrictions.
 * Undeclared response properties are retained, as allowed by the source schema.
 */
export interface ContractSchema {
  type?: string | string[]
  nullable?: boolean
  enum?: readonly unknown[]
  properties?: Record<string, ContractSchema>
  required?: readonly string[]
  items?: ContractSchema
  additionalProperties?: boolean | ContractSchema
}

export type TallyApiErrorCode = 'request_validation' | 'transport' | 'http' | 'response_validation'

export class TallyApiError extends Error {
  readonly name = 'TallyApiError'

  constructor(
    readonly code: TallyApiErrorCode,
    readonly operation: string,
    message: string,
    readonly status?: number,
    readonly response?: unknown,
    readonly cause?: unknown,
  ) {
    super(operation + ': ' + message)
  }
}

function mismatch(value: unknown, schema: ContractSchema, path: string): string | undefined {
  if (value === null && (schema.nullable || schema.type === 'null')) return undefined
  if (schema.enum && !schema.enum.includes(value)) return path + ' must match a documented enum value'
  if (schema.type === 'object' || schema.properties) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return path + ' must be an object'
    const record = value as Record<string, unknown>
    for (const key of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(record, key) || record[key] === undefined) return path + '.' + key + ' is required'
    }
    for (const [key, field] of Object.entries(schema.properties || {})) {
      if (Object.prototype.hasOwnProperty.call(record, key) && record[key] !== undefined) {
        const error = mismatch(record[key], field, path + '.' + key)
        if (error) return error
      }
    }
    for (const key of Object.keys(record)) {
      if (!Object.prototype.hasOwnProperty.call(schema.properties || {}, key)) {
        if (schema.additionalProperties === false) return path + '.' + key + ' is not allowed'
        if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
          const error = mismatch(record[key], schema.additionalProperties, path + '.' + key)
          if (error) return error
        }
      }
    }
    return undefined
  }
  if (schema.type === 'array') {
    if (!Array.isArray(value)) return path + ' must be an array'
    if (schema.items) {
      for (let index = 0; index < value.length; index++) {
        const error = mismatch(value[index], schema.items, path + '[' + index + ']')
        if (error) return error
      }
    }
    return undefined
  }
  if (schema.type === 'integer') return typeof value === 'number' && Number.isInteger(value) ? undefined : path + ' must be an integer'
  if (schema.type === 'number') return typeof value === 'number' && Number.isFinite(value) ? undefined : path + ' must be a finite number'
  if (schema.type === 'string' || schema.type === 'boolean') return typeof value === schema.type ? undefined : path + ' must be a ' + schema.type
  if (schema.type === 'null') return value === null ? undefined : path + ' must be null'
  return 'Unsupported validation schema at ' + path
}

export function validateRequest(value: unknown, schema: ContractSchema, operation: string, path: string): void {
  const error = mismatch(value, schema, path)
  if (error) throw new TallyApiError('request_validation', operation, error)
}

// The only narrowing boundary in the companion API. The same source produces
// TypeScript aliases and these validators; no unchecked generic cast of JSON.
export function validateResponse<T>(value: unknown, schema: ContractSchema, operation: string, status: number): asserts value is T {
  const error = mismatch(value, schema, 'response')
  if (error) throw new TallyApiError('response_validation', operation, error, status, value)
}
