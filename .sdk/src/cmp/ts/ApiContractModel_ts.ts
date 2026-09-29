// API-specific companion methods are explicitly named because this source spec
// has no operationId. All schemas still come from the upstream OpenAPI file.
const operations = [
  { name: 'listFoodEntries', path: '/food_entries', method: 'get' },
  { name: 'createFoodEntries', path: '/food_entries', method: 'post' },
  { name: 'parseFoodEntries', path: '/food_entries/parse', method: 'post' },
  { name: 'updateFoodEntry', path: '/food_entries/{id}', method: 'patch' },
  { name: 'deleteFoodEntry', path: '/food_entries/{id}', method: 'delete' },
  { name: 'listMoodEntries', path: '/mood_entries', method: 'get' },
  { name: 'createMoodEntry', path: '/mood_entries', method: 'post' },
  { name: 'deleteMoodEntry', path: '/mood_entries/{id}', method: 'delete' },
  { name: 'listWorkoutLogs', path: '/workout_logs', method: 'get' },
  { name: 'listSleepLogs', path: '/sleep_logs', method: 'get' },
  { name: 'getFeed', path: '/feed', method: 'get' },
] as const

type JsonSchema = {
  type?: string | string[]
  nullable?: boolean
  enum?: unknown[]
  properties?: Record<string, JsonSchema>
  required?: string[]
  items?: JsonSchema
  'x-ref'?: string
  additionalProperties?: boolean | JsonSchema
}

type ApiContract = {
  components: { schemas: Record<string, JsonSchema> }
  paths: Record<string, Record<string, {
    parameters?: Array<{ name: string, in: string, required?: boolean, schema: JsonSchema }>
    requestBody?: { required?: boolean, content: { 'application/json': { schema: JsonSchema } } }
    responses: Record<string, { content: { 'application/json': { schema: JsonSchema } } }>
  }>>
}

function loadContract(ctx: { meta?: { apidef?: { def?: ApiContract } } }): ApiContract {
  // @voxgig/sdkgen supplies apidef's resolved source definition on ctx$.
  // Reading this synchronously preserves the enclosing Jostraca Folder scope
  // and uses the same parsed .sdk/def/openapi.yaml as the entity generator.
  const source = ctx.meta?.apidef?.def
  if (!source) throw new Error('Tally typed API requires the resolved apidef source in generator context')
  const actual = Object.entries(source.paths).flatMap(([path, item]) =>
    Object.keys(item).filter(method => /^(get|put|post|patch|delete|head|options|trace)$/.test(method))
      .map(method => method + ' ' + path)).sort()
  const expected = operations.map(op => op.method + ' ' + op.path).sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error('Tally API operation mapping differs from OpenAPI; update ApiContractModel_ts.ts before generation')
  }
  return source
}

function title(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function typeSource(schema: JsonSchema, inline = false): string {
  const ref = schema['x-ref']
  if (!inline && ref?.startsWith('#/components/schemas/')) {
    return ref.slice('#/components/schemas/'.length)
  }
  let out: string
  if (schema.enum) {
    out = schema.enum.map(value => JSON.stringify(value)).join(' | ')
  }
  else if (schema.type === 'object' || schema.properties) {
    const required = schema.required || []
    const fields = Object.entries(schema.properties || {}).map(([name, property]) =>
      '  ' + JSON.stringify(name) + (required.includes(name) ? '' : '?') + ': ' + typeSource(property) + ';')
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      fields.push('  [key: string]: ' + typeSource(schema.additionalProperties) + ';')
    }
    out = '{\n' + fields.join('\n') + '\n}'
  }
  else if (schema.type === 'array') {
    if (!schema.items) throw new Error('Array schema is missing items')
    out = 'Array<' + typeSource(schema.items) + '>'
  }
  else if (schema.type === 'integer' || schema.type === 'number') out = 'number'
  else if (schema.type === 'string' || schema.type === 'boolean' || schema.type === 'null') out = schema.type
  else throw new Error('Unsupported schema in typed API generation: ' + JSON.stringify(schema))
  return schema.nullable && !schema.enum?.includes(null) ? '(' + out + ') | null' : out
}

// Only validation keywords supported by this specification are emitted. Fail
// closed on unsupported structural schema types through typeSource above.
function runtimeSchema(schema: JsonSchema): JsonSchema {
  typeSource(schema, true)
  const out: JsonSchema = {}
  if (schema.type) out.type = schema.type
  if (schema.nullable) out.nullable = true
  if (schema.enum) out.enum = schema.enum
  if (schema.required) out.required = schema.required
  if (schema.items) out.items = runtimeSchema(schema.items)
  if (schema.properties) {
    out.properties = Object.fromEntries(Object.entries(schema.properties).map(([name, property]) => [name, runtimeSchema(property)]))
  }
  if (schema.additionalProperties !== undefined) {
    out.additionalProperties = typeof schema.additionalProperties === 'object'
      ? runtimeSchema(schema.additionalProperties) : schema.additionalProperties
  }
  return out
}

export { loadContract, operations, title, typeSource, runtimeSchema }
export type { JsonSchema, ApiContract }
