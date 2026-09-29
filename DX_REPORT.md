# Voxgig SDK generator — Task 1 observations

## English

**API and method.** I chose the personal nutrition tracker at logwithtally.com, whose provider publishes an OpenAPI 3.1 specification. Catalogue searches for `tally` and `logwithtally` found no matching Voxgig SDK on 29 September 2026; differently named entries are not ruled out. I used `npm create @voxgig/sdkgen`, selected TypeScript and the test feature, then generated, built and tested the SDK.

**What worked.** The generator accepted the specification and produced five entities from eight paths and eleven HTTP operations. The initial offline suite reported 208 passes and one skip. The skip concerns the optional `cost` feature, which was not selected. The model/guide/template structure made corrections reproducible without hand-patching generated client files.

**Main engineering findings and changes.**

1. A valid food-list envelope was silently reduced to an empty list. The generated mock tests missed it. A failing fixture based on the provider's response revealed the issue; a `body.entries` guide override fixed it.
2. The inferred entity model mixed request and response fields, including required `input` in returned food records, and entity lists omitted aggregate values and feed cursors. I added a generator component exposing all eleven operations through `client.api`, with separate OpenAPI-derived request/response types and full envelopes. Legacy entity arrays remain available; response unions now describe legacy envelope operations honestly.
3. DELETE requests repeated path IDs in the query. The transport template now reads the canonical path-argument metadata; regression checks cover both DELETE endpoints and encoding. Independent acceptance also found that the new typed methods, which use `direct()`, bypassed the method allowlist. Request preparation now enforces exact method tokens before transport, with separate failing-then-passing regressions.
4. The generated build used Unix cleanup and shell quoting. The package component now uses Node cleanup and cross-platform quoting, with locked installation and Windows/Linux CI. The first Windows run then found that Markdown example parsers accepted only LF line endings. Both generator components now normalize CRLF/CR, with failing-then-passing extraction regressions. A package verifier loads the actual npm tarball outside the source checkout.
5. Initial documentation contained `Features: undefined`, installation links to unavailable tags, claims about unselected languages, vendor-only attribution and an unsupported vendor support promise. Root documentation and source installation guidance were corrected. A later generation restored some defaults; disabling the supported root `top` phase now preserves candidate-maintained files, verified by regeneration.
6. The manual publishing workflow built in one job but published from a fresh checkout. It now verifies a tarball and passes that artifact to the opt-in publishing step. No registry publication was performed.

**Verification and AI use.** Separate AI roles handled transport, API types, release engineering, contract QA and independent acceptance. Request/response fixtures cover all eleven operations, error paths, pagination and nullable values. Additional checks cover consumer types, documentation, regeneration and the packed client. Actual results and limitations are recorded in [AUDIT.md](AUDIT.md); the original specification and operation matrix are committed for review.

**Recommendations.** Generate request and response types from their separate source schemas; offer full-response operation methods alongside entity convenience methods; seed tests with documented response envelopes; preserve candidate-owned metadata explicitly; and test the distributable and Windows scripts in the scaffold's own CI. Missing optional-component warnings should state whether action is necessary.

**Limits.** No authenticated live test was possible without a Tally token, and free API access was not established. Human work was not timed, so I cannot claim compliance with the 30-minute limit. AI performed additional hardening at my direction. Source is MIT licensed in my own repository; no npm release is claimed.

## Русское резюме

Создан SDK через генератор Voxgig для Tally на logwithtally.com. Исправлены потеря записей питания, смешение типов запросов и ответов, потеря метаданных в основном интерфейсе полного ответа и дублирование ID в DELETE. Для всех 11 HTTP-операций добавлен типизированный `client.api`, сохраняющий полные ответы; прежние entity-методы сохранены.

Улучшены сборка, проверка пакета, CI, документация и воспроизводимость генерации. Отдельные ИИ-агенты реализовывали исправления, проверяли контракт API и проводили независимую приёмку. Доказательства находятся в AUDIT.md.

Реальные авторизованные запросы не выполнялись: токена нет. Время человеческой работы не измерялось, поэтому соблюдение 30 минут не утверждается. Публикации npm не было.
