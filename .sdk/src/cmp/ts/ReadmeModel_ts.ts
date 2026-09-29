
import { cmp, each, Content, isAuthActive, isHttpBasicAuth, serverVariables } from '@voxgig/sdkgen'

import {
  KIT,
  getModelPath,
} from '@voxgig/apidef'


const ReadmeModel = cmp(function ReadmeModel(props: any) {
  const { target, ctx$: { model } } = props

  const entity = getModelPath(model, `main.${KIT}.entity`)
  const entityList = each(entity).filter((e: any) => e.active !== false)

  // Model-driven op rows for the shared entity interface: emit a
  // load/list/create/update/remove row only for operations at least one active
  // entity actually exposes (a read-only entity has just list+load) — never
  // document an operation no entity has.
  const opUnion = new Set<string>()
  entityList.forEach((e: any) => Object.keys(e.op || {})
    .forEach((o: string) => { if (e.op[o] && e.op[o].active !== false) opUnion.add(o) }))
  const opRowDefs: Record<string, string> = {
    load: '| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria. |',
    list: '| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria. |',
    create: '| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity. |',
    update: '| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity. |',
    remove: '| `remove` | `remove(reqmatch?, ctrl?): Promise<Entity>` | Remove an entity. |',
  }
  const opRows = ['load', 'list', 'create', 'update', 'remove']
    .filter((o) => opUnion.has(o)).map((o) => opRowDefs[o]).join('\n')

  const singleOps = ['load', 'create', 'update'].filter((o) => opUnion.has(o))
    .map((o) => '`' + o + '`')
  const retBullets: string[] = []
  if (singleOps.length) {
    const joined = singleOps.length > 1
      ? singleOps.slice(0, -1).join(', ') + ' and ' + singleOps[singleOps.length - 1]
      : singleOps[0]
    retBullets.push(`- ${joined} ${singleOps.length > 1 ? 'resolve' : 'resolves'} to a single entity object.`)
  }
  if (opUnion.has('list')) {
    retBullets.push('- `list` resolves to an **array** of entity instances. The array has no `.data()` or `.ok`; call `.data()` on each item.')
  }
  if (opUnion.has('remove')) {
    retBullets.push('- `remove` resolves to the entity instance and marks `.deleted()` as true.')
  }
  const returnBullets = retBullets.join('\n')

  const authActive = isAuthActive(model)
  const authBasic = authActive && isHttpBasicAuth(model)
  const apikeyOptionType = authActive ? `\n  apikey?: string` : ''
  const secretOptionType = authBasic ? `\n  secret?: string` : ''
  const apikeyOptionRow = authActive
    ? '| `apikey` | `string` | API key for authentication. |\n'
    : ''
  const secretOptionRow = authBasic
    ? '| `secret` | `string` | API secret for authentication. |\n'
    : ''

  // Server variables are not one option among many: without them the
  // constructor THROWS, because the base URL is a template. Documented
  // first for that reason, and named individually so a reader knows what
  // to supply without going back to the spec.
  const svars = serverVariables(model)
  const serverOptionType = 0 === svars.length ? '' :
    `\n  server?: { ${svars.map((v: any) => `${v.name}: string`).join(', ')} }`
  const serverOptionRow = 0 === svars.length ? '' :
    '| `server` | `object` | **Required.** Values for the server-URL variables: ' +
    svars.map((v: any) => '`' + v.name + '`').join(', ') +
    '. The API base URL is a template over them. |\n'

  Content(`### ${model.const.Name}SDK

#### Constructor

\`\`\`ts
new ${model.const.Name}SDK(options?: {${apikeyOptionType}${secretOptionType}${serverOptionType}
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
\`\`\`

| Option | Type | Description |
| --- | --- | --- |
${serverOptionRow}${apikeyOptionRow}${secretOptionRow}| \`base\` | \`string\` | Base URL of the API server. |
| \`prefix\` | \`string\` | URL path prefix prepended to all requests. |
| \`suffix\` | \`string\` | URL path suffix appended to all requests. |
| \`feature\` | \`object\` | Feature activation flags (e.g. \`{ test: { active: true } }\`). |
| \`extend\` | \`Feature[]\` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| \`options()\` | \`object\` | Deep copy of current SDK options. |
| \`utility()\` | \`Utility\` | Deep copy of the SDK utility object. |
| \`prepare(fetchargs?)\` | \`Promise<FetchDef \\| Error>\` | Build an HTTP request definition without sending it. |
| \`direct(fetchargs?)\` | \`Promise<DirectResult \\| Error>\` | Build and send an HTTP request. |
`)

  each(entityList, (ent: any) => {
    const article = /^[aeiou]/i.test(ent.Name) ? 'an' : 'a'
    Content(`| \`${ent.Name}(entopts?)\` | \`${ent.Name}Entity\` | Create ${article} ${ent.Name} entity instance with optional entity options. |
`)
  })

  Content(`| \`tester(testopts?, sdkopts?)\` | \`${model.const.Name}SDK\` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| \`${model.const.Name}SDK.test(testopts?, sdkopts?)\` | \`${model.const.Name}SDK\` | Create a test-mode client. |

### Legacy entity interface

Each entity exposes only the operations listed for it below. The data types
are distinct from the entity classes. \`FoodEntry.data()\` and
\`MoodEntry.data()\` use unions because different operations store different
response shapes. The [exact types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts)
separate request bodies from responses.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
${opRows}
| \`data\` | \`data(data?: Partial<Data>): Data\` | Get or set entity data. |
| \`match\` | \`match(match?: Partial<Data>): Partial<Data>\` | Get or set entity match criteria. |
| \`make\` | \`make(): Entity\` | Create a new instance with the same options. |
| \`client\` | \`client(): ${model.const.Name}SDK\` | Return the parent SDK client. |
| \`entopts\` | \`entopts(): object\` | Return a copy of the entity options. |

#### Return values

On success, legacy entity operations return entity instances or arrays of
instances. Read each instance with \`.data()\`; a raw response envelope may
be stored there by create, parse or remove:

${returnBullets}

Entity operations throw on failure by default. Disabling throwing through
legacy control options changes that behavior. The recommended \`client.api\`
methods always reject failures and return operation-specific JSON bodies on
success. The low-level \`direct()\` method returns transport result information
as described below.

### DirectResult shape

The \`direct()\` method returns:

\`\`\`ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
\`\`\`

For a non-2xx HTTP response, \`ok\` is false, \`status\` is the HTTP status,
and \`data\` contains the parsed body when available; \`err\` is not guaranteed.
Transport and permission failures can instead return \`{ ok: false, err }\`,
and request preparation can return an \`Error\` directly. Check both forms.
Unlike \`client.api\`, \`direct()\` does not validate the response against an
operation schema; invalid JSON can leave \`data\` undefined even on HTTP success.

### FetchDef shape

On success, \`prepare()\` returns the following definition; on preparation or
permission failure it returns an \`Error\`. It never sends the request:

\`\`\`ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
\`\`\`

### Legacy entity field inventories

The following tables combine fields inferred from requests and responses;
they are not individual response schemas. Use the operation-specific
[exact types](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/src/TallyApiTypes.ts).

`)

  each(entityList, (ent: any) => {
    const fields = Object.values(ent.fields || {})
    const opnames = Object.keys(ent.op || {})
    const ops = ent.op || {}
    const points = each(ops).map((op: any) =>
      op.points ? each(op.points) : []
    ).flat()
    const path = points.length > 0 ? (points[0] as any).o || '' : ''

    Content(`#### ${ent.Name}

| Field | Description |
| --- | --- |
`)
    each(fields, (field: any) => {
      Content(`| \`${field.n}\` | ${field.sh || ''} |
`)
    })

    Content(`
Operations: ${opnames.join(', ')}.

API path: \`${path}\`

`)
  })

})


export {
  ReadmeModel
}
