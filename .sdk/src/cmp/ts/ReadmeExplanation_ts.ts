import { cmp, Content } from '@voxgig/sdkgen'

const ReadmeExplanation = cmp(function ReadmeExplanation(_props: { target?: unknown }) {
  Content(`## Entity state and transport

Legacy \`list()\` returns a new array of entity instances. Read those returned
instances with \`.data()\`; the parent entity does not become the returned
collection. Collection envelopes, totals and pagination metadata are available
through the corresponding \`client.api\` method.

\`\`\`ts
const parent = client.WorkoutLog()
const workouts = await parent.list()
for (const workout of workouts) {
  console.log(workout.data())
}
\`\`\`

Successful create and update operations store their response data on the
returned entity. Remove returns the same entity, stores the removal response
and marks \`.deleted()\` true. Call \`make()\` for a fresh instance with the same
client and options.

The typed \`client.api\` methods use the existing \`direct()\` transport with
configured authentication, base URL and \`system.fetch\`. They honor
\`allow.op\` for \`direct\` and the configured \`allow.method\` restrictions.
They validate declared request and response types and throw \`TallyApiError\`.
The legacy entity feature pipeline and generic test feature are separate;
use an injected \`system.fetch\` for offline tests of \`client.api\`.

The included test feature exercises legacy entities. The project also has
[independent contract checks](https://github.com/angle-theory-studio/tally-sdk/tree/main/checks)
covering complete responses, request placement, errors, permissions and types.

`)
})

export { ReadmeExplanation }
