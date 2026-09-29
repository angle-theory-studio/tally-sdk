import { cmp, Content, File } from '@voxgig/sdkgen'
import { ReadmeIntro } from './ReadmeIntro_ts'
import { ReadmeInstall } from './ReadmeInstall_ts'
import { ReadmeQuick } from './ReadmeQuick_ts'
import { ReadmeModel } from './ReadmeModel_ts'
import { ReadmeOptions } from './ReadmeOptions_ts'
import { ReadmeEntity } from './ReadmeEntity_ts'
import { ReadmeExplanation } from './ReadmeExplanation_ts'
import { ReadmeRef } from './ReadmeRef_ts'

// Project-owned composition avoids generic package prose that incorrectly
// describes list() parent state and does not know about this typed companion.
const Readme = cmp(function Readme(props: { target: unknown }) {
  const { target } = props
  File({ name: 'README.md' }, () => {
    ReadmeIntro({ target })
    Content('## Install\n\n')
    ReadmeInstall({ target })
    Content('## Client setup and legacy entity example\n\n')
    ReadmeQuick({ target })
    Content(`## Error handling

Recommended \`client.api\` calls reject with \`TallyApiError\`. Its \`code\` is
\`request_validation\`, \`transport\`, \`http\` or \`response_validation\`.
HTTP errors preserve the status and response body in \`status\` and
\`response\`; inspect that body for the API's \`error\` or \`errors\` details.
For transport failures, \`cause\` retains the underlying error when available.

`)
    Content('## Reference\n\n')
    ReadmeModel({ target })
    ReadmeOptions({ target })
    ReadmeEntity({ target })
    ReadmeExplanation({ target })
    Content(`## Full reference

See the [API contract](https://github.com/angle-theory-studio/tally-sdk/blob/main/API_CONTRACT.md)
and [legacy reference](https://github.com/angle-theory-studio/tally-sdk/blob/main/ts/REFERENCE.md).
`)
  })
  ReadmeRef({ target })
})

export { Readme }
