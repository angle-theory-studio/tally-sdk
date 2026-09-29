# Voxgig mini Task 1

Unofficial **TypeScript** SDK for the personal nutrition tracker at [logwithtally.com](https://www.logwithtally.com), generated using Voxgig's SDK tools. This is not Tally Forms or Tally's governance API.

Candidate profile: [angle-theory-studio](https://github.com/angle-theory-studio). Repository: [tally-sdk](https://github.com/angle-theory-studio/tally-sdk).

## Result and scope

- Generated five entity classes from an upstream definition containing eight paths and eleven HTTP operations; this does not establish complete SDK operation coverage.
- Build succeeded on Linux with Node.js 24.19.0 and npm 11.9.0.
- Generated offline tests: **209 total, 208 passed, one skipped, zero failed**. The skipped `FeatureCorpus / cost` test concerns an optional feature not selected for this SDK.
- A separate API-contract regression check passes after correcting the inferred food-list response mapping. It failed against the original generated mapping.
- Generator `doctor` reported that the scaffold matches. This is a scaffold check, not proof of API compatibility.
- No authenticated live API request was made: an API token was not available. Availability of a free API tier was not verified.
- Source is MIT licensed with upstream attribution retained. No npm package, release tag, or other language target is published as part of this submission.
- AI was used to select the API, run generation and checks, and prepare documentation. Human time was not measured, so compliance with the 30-minute human-work limit is not claimed.

See [DX_REPORT.md](DX_REPORT.md) for the short developer experience report.

## Build and test the source

Prerequisites: Git, Node.js 24 and npm. Clone this repository, then enter the TypeScript target:

```sh
git clone https://github.com/angle-theory-studio/tally-sdk.git
cd tally-sdk/ts
npm ci
node -e "for (const p of ['dist','dist-test']) require('node:fs').rmSync(p,{recursive:true,force:true})"
npx tsc --build src test --force
node --enable-source-maps --test-concurrency=1 --test "dist-test/**/*.test.js"
node --test ../checks/api-contract.test.cjs
```

The explicit commands avoid the Unix `rm -rf` in the generated npm build script. They were checked on Linux; Windows was not available for execution testing. After compiling, the CommonJS entry point is `ts/dist/TallySDK.js` and the declaration file is `ts/dist/TallySDK.d.ts`.

From inside `ts/`, check that the compiled entry point loads:

```sh
node -e "const {TallySDK}=require('./dist/TallySDK.js'); console.log(typeof TallySDK)"
```

The expected output is `function`. This check does not contact the API.

## Reproduce generation

The original upstream definition is committed at `.sdk/def/openapi.yaml`. Source configuration for the model and test build actions is also committed. For the existing project:

```sh
cd .sdk
npm ci
npm run generate
```

Run this block from the repository root. Generated client source is not hand-patched. Candidate metadata is in the project model overlay; the food-list response correction is in `.sdk/model/guide/guide.aontu`. Root documentation, licensing and release configuration are candidate-maintained. The project overlay disables the generator's root `top` phase so it does not overwrite these files; TypeScript target generation remains enabled. Review root documentation and release configuration manually when the target or toolchain changes.

Verified from a fresh copy of the submitted source using `npm ci --offline` with a populated npm cache, followed by `npm run generate`: both succeeded. Root README, LICENSE, SECURITY, CHANGELOG and the candidate CI/publish workflows remained byte-identical; TypeScript source was unchanged. This check did not verify availability of dependencies from the public npm registry on a machine without a cache.

## Known generated limitations

The generated README has `Features: undefined` and points to unavailable release tags. The original generated changelog claimed targets not present in this project, and its security policy named Voxgig with an unsupported response-time promise; the root changelog and security policy were corrected for this candidate-owned submission.

The generated npm publishing workflow is **not ready for release**: its publish job starts from a fresh checkout without the compiled output produced in the verification job. It is manual and was not run. This task publishes source only.

Response types, feed pagination metadata and redundant DELETE query parameters still have limitations described in [AUDIT.md](AUDIT.md). Offline tests do not prove full live API compatibility.
