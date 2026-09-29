# Engineering verification record

Date: 29 September 2026. Scope: the Tally TypeScript source submission, its generator inputs, contract behavior, documentation and distributable. Authenticated server compatibility is a separate, unperformed check.

## Review structure

Separate AI roles handled requirements and the API matrix, transport implementation, API/type implementation, release engineering, independent contract QA and independent acceptance. The acceptance reviewer did not implement the fixes. The coordinator integrated the work and checked a clean source copy. This separation is an evidence control, not a guarantee that no defect can remain.

## Defects closed

| Finding | Correction | Evidence |
| --- | --- | --- |
| Food list silently discarded valid entries | Guide mapping to `body.entries` followed by regeneration | Original regression failed before the fix; retained in contract tests |
| DELETE repeated path ID in query | Canonical path arguments read from `point.args.params`; legacy metadata supported | Transport tests failed 3/10 before the correction and pass 10/10 after |
| Request fields and response fields were conflated | Separate OpenAPI-derived request/response aliases; truthful legacy unions | Positive/negative consumer TypeScript fixture and build |
| Aggregate values and feed cursor were unavailable through entity lists | Generated `client.api` exposes all 11 operations with complete envelopes | Independent fixtures verify every wire route, totals, cursor, nulls, unknown fields and ordering |
| Errors could be mistaken for successful empty data | Typed companion rejects request validation, transport, HTTP and response-schema failures | HTTP 401/422, network, invalid JSON and malformed-schema fixtures |
| Typed and direct requests bypassed the HTTP-method allowlist | Normalize and check exact method tokens in `prepare()` before transport | GET-only policy permits all five reads and rejects all six writes; direct/prepare reject forbidden and substring methods before fetch |
| Unix-specific build and quoting | Node cleanup and cross-platform npm scripts; locked installs | Local clean build; Ubuntu/Windows CI configured for the same gates |
| Windows documentation examples failed after successful compilation | Normalize CRLF/CR in both generated Markdown extractors | First Windows CI reproduced 7 failures; two independent line-ending regressions failed before the fix and pass after it |
| Package publication used a fresh unbuilt checkout | Manual workflow verifies and transfers the exact packed artifact | Missing-dist artifact is rejected; complete tarball loads outside the checkout |
| Package verifier failed on Windows drive-letter paths | Supply the already integrity-checked archive bytes to tar through stdin; set extraction cwd through Node | Windows CI reproduced the path error after all SDK checks passed; corrected helper verified against the real 238-file tarball |
| Generated documentation contradicted candidate ownership and publication status | Corrected root docs, attribution, source installation and security guidance | Readable source instructions, tested README example, source/packed LICENSE |
| Packaged reference mixed request and response fields and misstated entity return/state behavior | Generate a typed-API entry section and accurate legacy return/state guidance; label mixed field inventories | Independent review of generated README/reference against runtime and declarations |
| Regeneration reverted maintained root docs | Disable supported root `top` phase while keeping target generation | Byte comparison of maintained files across generation |
| Source export omitted model build configuration | Commit source AONTU configuration and exclude regenerated JSON | Fresh-source installation and full regeneration succeed |

The earlier source-publication verdict at `52238a7…` was premature because published LICENSE/README/SECURITY still contradicted the report. This was corrected at `f12c78d…`; the subsequent engineering pass closes the known functional and packaging issues above. Generated client files are derived from source components/templates, not manually patched.

## Executed checks

Environment for local execution: Linux, Node.js 24.19.0, npm 11.9.0. The final clean source copy excluded dependencies, compiled output and generated model-configuration JSON.

| Check | Observed result |
| --- | --- |
| Locked installation in generator and TypeScript target | `npm ci --offline` exited 0, using the existing npm cache |
| Complete generation from clean source | `npm run generate` exited 0 |
| Regenerated source and maintained-file identity | 119 files compared; zero differences; temporary documentation-test snippets excluded |
| Generated TypeScript build and tests | 211 tests: 210 passed, 1 skipped, 0 failed; includes two LF/CRLF/CR extraction regressions |
| Skip reason | `FeatureCorpus / cost`; optional feature not selected, not a skipped API endpoint |
| Independent API contract checks | 32 passed, including all 11 HTTP operations and method restrictions |
| Actual README example | 2 passed: with and without a pagination cursor |
| Transport regression checks | 20 passed, including direct/prepare method restrictions |
| Combined independent checks | 54 passed, 0 skipped, 0 failed |
| Strict consumer declarations | `checks/api-types.ts` passed with expected negative cases enforced |
| npm tarball | 238 files; required runtime/declarations/license present; SHA512 checked |
| Isolated packaged runtime | Imports without the source checkout; all 11 methods exported; injected GET preserves response and authentication |
| Optional live script without credentials | Exits nonzero with an actionable message; does not report a skipped test as success |

The clean-copy run repeated the generated suite, all 54 independent checks, consumer type checks and package verification successfully. These tests use fixed responses from the committed provider specification; they do not use a live Tally account.

## CI and publication gates

[CI](.github/workflows/ci.yml) runs the actual TypeScript target on Ubuntu and Windows: locked install, build/generated tests, independent contract/example/transport tests, consumer type checks, package creation and isolated package verification. Absent language targets are no longer represented by misleading successful no-op jobs. [Documentation](.github/workflows/docgen.yml) generates and checks documentation separately. See [GitHub Actions](https://github.com/angle-theory-studio/tally-sdk/actions) for the published commit's platform-specific outcomes.

The manual npm workflow defaults to verification. Its optional publish job consumes the verified tarball and has a separate tagging step. Local tests exercised registry decisions with controlled responses: new version and identical integrity accepted; conflicting integrity and HTTP 503 rejected. Actual registry publishing, trusted-publishing setup and OIDC authentication have not been exercised. No npm release or release tag has been created.

## Human effort

On 29 September 2026, the candidate confirmed 30 minutes of personal participation. This duration is candidate-reported. AI performed the additional engineering and QA at the candidate's direction.

## Remaining boundaries

- No authenticated live request was made: a Tally token was unavailable. Free API-tier access, quotas and account permissions are not established.
- Upstream response fields are mostly optional; the client does not invent required fields or stricter minimum values. Runtime validation covers declared JSON structure/types/required/enum/nullability, not additional date-format rules.
- Legacy `list()` intentionally remains an entity array. Use `client.api` for complete aggregate values and cursors. Corrected legacy response unions can require TypeScript caller changes, documented in CHANGELOG.
- Schema-derived validation is tied to the committed specification. Unexpected server shapes will produce an explicit validation error; offline tests cannot certify every real server variant.
- The local fresh-install check used a populated npm cache. It does not prove registry availability on every machine.

Reproduction commands are in [SUBMISSION.md](SUBMISSION.md). Exact operation contracts and source-spec identity are in [API_CONTRACT.md](API_CONTRACT.md).
