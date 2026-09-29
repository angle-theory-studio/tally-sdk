
import { cmp, Content, installCommand, isPublished } from '@voxgig/sdkgen'


const ReadmeInstall = cmp(function ReadmeInstall(props: any) {
  const { target, ctx$ } = props
  const { model } = ctx$

  if (isPublished(model, target.name)) {
    Content('```bash')
    Content(`
${installCommand(model, target.name)}
`)
    Content('```')
    return
  }

  Content(`This package has no npm release or release tag. Build the committed
source using [SUBMISSION.md](https://github.com/angle-theory-studio/tally-sdk/blob/main/SUBMISSION.md). From the repository root:

\`\`\`sh
cd ts
npm ci
npm run build
npm test
\`\`\`

The CommonJS entry point is \`ts/dist/TallySDK.js\`; declarations are in
\`ts/dist/TallySDK.d.ts\`. The package name below describes the prepared package,
not an already published npm release.

`)
})


export {
  ReadmeInstall
}
