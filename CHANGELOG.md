# Changelog

Candidate-maintained record for this generator evaluation. No npm release has been published.

## Unreleased — engineering hardening

- Add a generated `client.api` interface for all eleven documented HTTP operations, preserving full response envelopes and pagination metadata.
- Derive request/response types and runtime validation schemas from the provider specification; expose structured transport, HTTP and validation errors.
- Correct legacy response aliases. TypeScript consumers of FoodEntry and MoodEntry envelope operations may need union narrowing; `list()` still returns entity arrays.
- Exclude path IDs from DELETE query parameters; retain supported transport encoding and false/zero/empty query values.
- Enforce exact HTTP-method allowlists in typed, direct and prepared requests before transport; normalize lowercase methods.
- Make npm build/test cleanup and quoting work across operating systems; preserve lockfiles on reset.
- Add independent endpoint fixtures, error and pagination cases, positive/negative type checks, executable examples and isolated package checks.
- Replace unused-language CI jobs with TypeScript checks on Ubuntu and Windows. Verify the exact tarball used by the optional publishing workflow.
- Improve source installation, attribution and documentation. Preserve maintained root files during SDK regeneration.

## Initial source submission

- Generate the TypeScript target and test feature using Voxgig SDK tools.
- Correct the food-list response mapping through the guide and regeneration.
- Add MIT attribution, task notes, a DX report and an independent audit.
