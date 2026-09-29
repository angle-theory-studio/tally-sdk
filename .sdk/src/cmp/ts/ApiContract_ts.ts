import { cmp, File, Content } from '@voxgig/sdkgen'
import { loadContract, operations, title, typeSource, runtimeSchema } from './ApiContractModel_ts'
import type { JsonSchema } from './ApiContractModel_ts'

const ApiContract = cmp(function ApiContract(props: { target?: unknown, ctx$?: { meta?: { apidef?: { def?: import('./ApiContractModel_ts').ApiContract } } } }) {
  const spec = loadContract(props.ctx$ || {})
  const methods: string[] = []
  const types: string[] = []
  const schemas: Record<string, JsonSchema> = {}

  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    types.push('export type ' + name + ' = ' + typeSource(schema, true))
  }

  for (const op of operations) {
    const source = spec.paths[op.path][op.method]
    const prefix = title(op.name)
    const query = (source.parameters || []).filter(param => param.in === 'query')
    const path = (source.parameters || []).filter(param => param.in === 'path')
    const body = source.requestBody?.content['application/json'].schema
    const success = Object.keys(source.responses).filter(status => /^2\d\d$/.test(status))
    if (success.length !== 1) throw new Error('Expected one success response for ' + op.name)
    const response = source.responses[success[0]].content['application/json'].schema
    const args: string[] = []
    const setup: string[] = []
    const fetchargs: string[] = ["method: '" + op.method.toUpperCase() + "'"]
    let url = JSON.stringify(op.path)

    if (path.length) {
      if (path.length !== 1 || path[0].name !== 'id') throw new Error('Unexpected path parameters: ' + op.name)
      args.push('id: ' + typeSource(path[0].schema))
      schemas[prefix + 'Id'] = runtimeSchema(path[0].schema)
      setup.push("validateRequest(id, schemas." + prefix + "Id, '" + op.name + "', 'id')")
      url = '`' + op.path.replace('{id}', '${encodeURIComponent(String(id))}') + '`'
    }
    fetchargs.push('path: ' + url)
    if (query.length) {
      const querySchema: JsonSchema = { type: 'object', properties: {}, required: [] }
      query.forEach(param => {
        querySchema.properties![param.name] = param.schema
        if (param.required) querySchema.required!.push(param.name)
      })
      types.push('export type ' + prefix + 'Query = ' + typeSource(querySchema))
      schemas[prefix + 'Query'] = runtimeSchema(querySchema)
      args.push('query: Api.' + prefix + 'Query = {}')
      setup.push("validateRequest(query, schemas." + prefix + "Query, '" + op.name + "', 'query')")
      // Undeclared query keys never leak onto the wire (even from JS callers).
      fetchargs.push('query: { ' + query.map(param => JSON.stringify(param.name) + ': query[' + JSON.stringify(param.name) + ']').join(', ') + ' }')
    }
    if (body) {
      types.push('export type ' + prefix + 'Body = ' + typeSource(body))
      schemas[prefix + 'Body'] = runtimeSchema(body)
      args.push('body: Api.' + prefix + 'Body')
      setup.push("validateRequest(body, schemas." + prefix + "Body, '" + op.name + "', 'body')")
      fetchargs.push('body')
    }
    types.push('export type ' + prefix + 'Response = ' + typeSource(response))
    schemas[prefix + 'Response'] = runtimeSchema(response)
    methods.push(`  async ${op.name}(${args.join(', ')}): Promise<Api.${prefix}Response> {
    ${setup.join('\n    ')}
    const response = await this.request('${op.name}', { ${fetchargs.join(', ')} })
    validateResponse<Api.${prefix}Response>(response.data, schemas.${prefix}Response, '${op.name}', response.status)
    return response.data
  }`)
  }

  File({ name: 'TallyApiTypes.ts' }, () => Content(`// Generated from .sdk/def/openapi.yaml. Optional and nullable fields follow the source specification.\n\n${types.join('\n\n')}\n`))
  File({ name: 'TallyApiSchemas.ts' }, () => Content(`// Generated runtime schemas from the same OpenAPI source as TallyApiTypes.\nimport type { ContractSchema } from './ApiValidation'\n\nexport const schemas = ${JSON.stringify(schemas, null, 2)} satisfies Record<string, ContractSchema>\n`))
  File({ name: 'TallyApi.ts' }, () => Content(`// Generated full-response companion API. Existing entity methods remain available.
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

${methods.join('\n\n')}
}

export { TallyApiError }
`))
})

export { ApiContract }
