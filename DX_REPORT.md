# Voxgig SDK Generator — Task 1 engineering notes

## English

**API:** Tally, the personal nutrition tracker at logwithtally.com (not tally.so). Its provider publishes an OpenAPI 3.1 specification at https://www.logwithtally.com/api.yaml. Searches of the Voxgig SDK catalog and the `voxgig-sdk` GitHub organization by `tally` and `logwithtally` on 29 September 2026 found no matches. This is search evidence, not a guarantee against differently named repositories.

**Path taken:** Downloaded the upstream specification; ran `npm create @voxgig/sdkgen -- tally -d ./openapi.yaml -o ./tally-sdk`; added the TypeScript target and `test` feature; ran `npm run generate`; installed, built and tested `ts/`; ran `voxgig-sdkgen doctor`.

**Result:** Generation and TypeScript build succeeded. The generated offline suite reported 209 tests: 208 passed, one skipped, zero failed. A separate contract check exposed a food-list response bug; after a guide override and regeneration, that check passes too. `doctor` reported that the scaffold matches. No authenticated live request was made because no Tally token was available.

**Developer experience findings:**

1. The documented generation path accepted OpenAPI 3.1 and inferred five entities from eight paths and eleven HTTP operations. Generated mock tests missed a response-envelope error: `FoodEntry.list()` silently returned `[]` for valid records. A guide override from `body` to `body.entries`, followed by regeneration, fixed it. The regression failed before the correction and passes afterward.
2. The generated root README says `Features: undefined` despite the test feature being selected. This is a documentation defect; it did not block the build.
3. The initial generated README pointed installation links to `github.com/voxgig-sdk/tally-sdk` and used `@voxgig-sdk/tally-sdk` as the package name. Those defaults were misleading for a candidate-owned project. A project overlay now sets the candidate's repository and TypeScript package metadata; regeneration corrected the links and package name.
4. The initial root MIT LICENSE said `Copyright (c) 2026 Voxgig`, while the root template said `Copyright (c) 2026 Tally`. We added the candidate account to the root license and set the project template to that account while retaining the generator's original attribution. Vendored source and its license retain their original attribution.
5. The generator printed missing optional component warnings for `ReadmeFeatures_ts` and `AgentGuide_ts`, but generation and tests completed. The warning could explain what action, if any, is expected.
6. Generated installation instructions point to release tags that do not yet exist. The npm build script uses Unix `rm -rf`, which is unsuitable for the default Windows npm shell. [SUBMISSION.md](SUBMISSION.md) supplies explicit source build commands; execution was checked on Linux only.
7. Generated changelog boilerplate claimed six language targets plus CLI/MCP even though only TypeScript was selected. The generated security policy named Voxgig and promised a three-business-day response. Candidate-maintained root documentation corrects these claims.
8. Static review found that the manual npm publishing workflow verifies a build in one job, then publishes from a fresh checkout without transferring the compiled output. The workflow was not run and no npm release is claimed.
9. Response typing, feed pagination metadata and redundant DELETE query parameters remain limitations. Details and verification evidence are in [AUDIT.md](AUDIT.md). My main recommendation is to generate tests from documented response envelopes as well as the internal mock model.

**Delivery:** Source, MIT license, reproduction instructions and this report for https://github.com/angle-theory-studio/tally-sdk. No npm release or authenticated live verification is claimed; free API-tier access was not verified. Human time was not measured, so the 30-minute limit is not claimed. AI assisted generation, independent review and verification. Generated client source was not hand-patched: metadata and the response fix use the model/guide, followed by regeneration. Root documentation and CI regression coverage were updated separately.

## Русский перевод

**API:** Tally для учёта питания на logwithtally.com (не tally.so). Разработчик публикует OpenAPI 3.1 по адресу https://www.logwithtally.com/api.yaml. Поиск в каталоге SDK Voxgig 29 сентября 2026 года не нашёл Tally; это результат поиска по каталогу, а не гарантия отсутствия любого репозитория с иным названием.

**Что сделано:** загружена спецификация, запущен официальный генератор, добавлены TypeScript и тестовый режим, выполнены генерация, установка, сборка, тесты и проверка `doctor`.

**Результат:** генерация и сборка прошли. Из 209 тестов 208 прошли, один пропущен, ошибок нет. `doctor` не нашёл отклонений. Реальный запрос с авторизацией не выполнялся: токена Tally у нас нет.

**Наблюдения о DX:** генерация, локальная сборка и offline-тесты прошли успешно; генератор вывел пять сущностей из восьми путей и одиннадцати HTTP-операций. Дополнительный тест обнаружил потерю записей в `FoodEntry.list()`: исправление `body.entries` внесено через guide и регенерацию. Тест падал до исправления и проходит после него. В README указано `Features: undefined`. Ссылки и имя пакета заменены через модель на аккаунт кандидата. В MIT-файле сохранена исходная атрибуция и добавлен владелец проекта. Предупреждения `ReadmeFeatures_ts` и `AgentGuide_ts` не остановили сборку.

**Дополнительные замечания:** инструкции установки ссылаются на ещё не созданные теги; команда сборки использует Unix `rm -rf`. В SUBMISSION.md добавлены команды сборки из исходников, проверенные на Linux. Автоматический changelog ошибочно перечислял отсутствующие языки и CLI/MCP; политика безопасности обещала ответ от Voxgig за три рабочих дня. Эти корневые документы исправлены. В ручном workflow публикации npm результат сборки не передаётся в отдельную задачу публикации; этот workflow не запускался.

**Передача результата:** исходники и отчёт для https://github.com/angle-theory-studio/tally-sdk. Проверки с настоящим токеном и публикации npm нет. Бесплатный доступ к API не проверен. Время работы человека не замерялось, поэтому соблюдение лимита в 30 минут не заявляется. Использован ИИ. Исходники клиента не исправлялись вручную; исправление ответа выполнено через guide и регенерацию. Оставшиеся ограничения описаны в AUDIT.md.
