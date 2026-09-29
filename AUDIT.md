# Submission audit — 29 September 2026

Separate AI reviewers checked engineering behavior, task requirements, documentation and publication readiness. The engineering reviewer implemented the response-mapping correction after reproducing it; final source-publication acceptance is reviewed separately. This is a bounded generator evaluation, not a production certification.

## Corrected before delivery

1. **Food-list data loss.** The documented API response wraps records in `entries`. The generated mapping used the complete `body`, so a valid non-empty response became `[]`. A supported override in `.sdk/model/guide/guide.aontu` selects `body.entries`; the client was regenerated. `checks/api-contract.test.cjs` failed before the correction and passes afterward. It checks the URL, method, Bearer header, absence of a GET body and preservation of the returned record using an injected fetch with no network.
2. **Packaging configuration.** An earlier source archive omitted the model and test build-action AONTU configuration. The published source includes both files so regeneration can load `apidef` and `sdkgen`. Generated config JSON and compiled output remain excluded.
3. **Documentation.** Added source installation instructions and replaced incorrect multi-language release claims and unsupported security-response promises in root documentation.
4. **Final publication re-audit.** Review of published commit `52238a7af56ddeda09875d868430a0ea3ec6c238` found that the root README, LICENSE and SECURITY policy had been overwritten by generation, contradicting the earlier report. Restored the submission entry point, candidate and upstream attribution, and candidate security guidance. The project overlay now disables the root `top` generation phase while retaining TypeScript generation, protecting these maintained files from the identified overwrite path. The previous publication-readiness conclusion was premature.

## Verification

| Check | Observed result |
| --- | --- |
| TypeScript build | Exit 0 |
| Generated offline suite | 209 total: 208 passed, one skipped (`FeatureCorpus / cost`, optional feature not selected), zero failed |
| Food response regression | One failed before fix; one passed after fix |
| Generator doctor | Exit 0, scaffold matches, zero additive |
| Clean source regeneration after final correction | `npm ci --offline` and `npm run generate` exited 0; README, LICENSE, SECURITY, CHANGELOG and candidate CI/publish workflows remained byte-identical; TypeScript source also remained unchanged |
| Live authenticated API | Not run |
| npm publication | Not performed |

Build and test commands are in [SUBMISSION.md](SUBMISSION.md). The regression is additional to the 209 generated tests. Review of source and archive found no credentials using common secret patterns; this is not an exhaustive security guarantee.

## Remaining generator observations

- `FoodEntry.create()` and its parse action retain response envelopes in `.data()`, while the declared type is `FoodEntry`. The inferred type also requires `input`, absent from returned entry objects. Full response type fidelity is unverified (`ts/src/TallyTypes.ts`).
- `Feed.list()` returns `body.days` without the `older_before` pagination metadata. The low-level `direct()` response retains the full envelope (`ts/src/Config.ts`, `.sdk/def/openapi.yaml`).
- DELETE requests repeat the path ID as a query parameter, for example `/food_entries/11?id=11`. Query preparation reads `point.params`, whereas generated arguments are under `point.args.params`; server tolerance is untested (`ts/src/utility/PrepareQueryUtility.ts`).
- Root README contains `Features: undefined`; generated installation guidance refers to release tags that do not exist. The candidate submission guide takes precedence for installation.
- Manual npm publication verifies in one job and publishes from a separate clean checkout without transferring the compiled package output. Do not use that workflow for this source submission.

These are recorded limitations for feedback to the generator authors. No claim is made that all API behavior is correct. Human work was not timed, and authenticated testing and free API-tier access were not established.
