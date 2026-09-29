# Voxgig mini Task 1

Unofficial TypeScript SDK for [Tally's personal nutrition tracker](https://www.logwithtally.com), generated with Voxgig SDK tools and customized through the project's model, components and templates.

Candidate profile: [angle-theory-studio](https://github.com/angle-theory-studio). Repository: [tally-sdk](https://github.com/angle-theory-studio/tally-sdk).

## Deliverables

- The original provider specification, generator configuration, templates, generated TypeScript source and lockfiles.
- A typed `client.api` method for each of the 11 documented HTTP operations, with complete response envelopes and declared-schema validation.
- The original entity API; corrected request/response aliases and a fix for duplicate path IDs in query parameters.
- Independent request/response fixtures, positive and negative TypeScript usage checks, executable README checks and package verification.
- MIT licensing with candidate and upstream attribution, an English [DX report](DX_REPORT.md), [contract matrix](API_CONTRACT.md) and [verification record](AUDIT.md).

The response types follow upstream optional/nullable fields. Unknown response properties are retained. Authentication, base URL, injected fetch and the original direct-operation permission gate remain in use. The companion rejects HTTP failures, transport failures and response schema violations. Legacy `.data()` declarations now expose response unions where the actual response varies by operation; existing TypeScript callers may need narrowing.

## Build and verify

Prerequisites: Git and Node.js 24 with npm. These commands use cross-platform Node cleanup; they do not require Unix `rm`.

```sh
git clone https://github.com/angle-theory-studio/tally-sdk.git
cd tally-sdk/ts
npm ci
npm test
cd ..
node --test "checks/*.test.cjs"
node ts/node_modules/typescript/bin/tsc --strict --noEmit --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext checks/api-types.ts
```

`npm test` first compiles the client and generated tests. The separate checks verify actual request/response contracts and documentation. See [AUDIT.md](AUDIT.md) for observed results and operating-system coverage.

After compilation, require `./ts/dist/TallySDK.js` from the repository root. Type declarations are in `ts/dist/TallySDK.d.ts`. No npm package or Git release tag has been published.

## Verify the distributable

From the repository root:

```sh
node -e "require('node:fs').mkdirSync('package-output',{recursive:true})"
cd ts
npm pack --json --ignore-scripts --pack-destination ../package-output > ../package-output/pack.json
cd ..
node checks/package-artifact.cjs package-output/pack.json
```

The verifier checks required files, SHA512 integrity and an isolated Node process importing the extracted package. It also exercises the packed `api` client with an injected response. The helper requires `tar`, available in the Linux and Windows GitHub runners used by CI.

The manual publishing workflow defaults to verification only. Actual npm publication requires separate configuration of npm trusted publishing and explicit selection of `publish=true`. It publishes the verified tarball rather than a fresh unbuilt checkout. Registry publication and OIDC authentication are not claimed as tested by local package checks.

## Reproduce generation

From the repository root:

```sh
cd .sdk
npm ci
npm run generate
```

The official specification is `.sdk/def/openapi.yaml`. Its 11 HTTP operations are explicitly mapped to method names because the upstream definition has no `operationId`; a changed operation set fails generation until that mapping is updated. Types and runtime schemas are derived from the resolved upstream schemas, not an independently maintained response copy.

- Project metadata and `top.active:false`: `.sdk/model/project.aontu`.
- Food-list response mapping: `.sdk/model/guide/guide.aontu`.
- Typed API, schema emission and legacy aliases: `.sdk/src/cmp/ts/`.
- Validation and query transport: `.sdk/tm/ts/src/`.

Generated client files are not patched by hand. The root `top` phase is disabled to preserve candidate-maintained documentation, attribution and release configuration; review these files manually when changing project targets or the toolchain. Separate docgen commands can still update their own outputs.

## Optional authenticated read-only check

Obtain a token from your own Tally account using the provider's documented Settings → API Access flow. Keep it in the process environment under `TALLY_APIKEY`. After building, run:

```sh
node checks/live-readonly.cjs
```

This explicit opt-in script makes five GET requests, has a timeout and prints only operation status. It does not print the token or personal records and does not create, modify or delete account data. It is excluded from default offline tests. Missing credentials cause a nonzero exit, not a successful skipped test.

## Limits of the submission

Authenticated live calls have not been performed because a Tally API key was unavailable. Free API-tier availability and account-specific permissions have not been established. The supplied OpenAPI contract and injected responses are the basis of offline verification.

The candidate confirms 30 minutes of personal participation. AI performed additional engineering and QA at the candidate's direction. No claim is made that every possible server response, deployment environment or real-account workflow has been tested.
