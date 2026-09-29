
import {
  Content,
  File,
  cmp,
} from '@voxgig/sdkgen'


const Gitignore = cmp(async function Gitignore(_props: any) {
  File({ name: '.gitignore' }, () => {
    Content(`# Dependencies
node_modules/

# Build output
# This source submission builds compiled files from the committed inputs.
# npm pack explicitly includes dist after the build; Git does not.
dist/
dist-test/
*.tsbuildinfo

# Temporary sources emitted while validating documentation examples.
test/.examples_*.gen.ts

# Coverage
coverage/

# Logs
*.log
npm-debug.log*

# IDE / OS
.idea/
.vscode/
.DS_Store
`)
  })
})


export {
  Gitignore
}
