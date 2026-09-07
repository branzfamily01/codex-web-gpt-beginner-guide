# AGENTS.md — Codex Web GPT Beginner Guide

## Governance
- Astra: Chief Architect only for major protected-delivery/auth or fundamental platform/repository architecture.
- Sol: Main Operator for tutorial content, information architecture, current technical verification, UX, docs, Codex tasks and review.
- Codex: Repository Implementer.

## Read first
- `README.md`
- `docs/REQUIREMENTS.md`
- `docs/MASTER_ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/PROJECT_STATE.md`

## Content rules
- Write for beginners and explain purpose, exact action, expected result and failure recovery for important procedures.
- Do not invent current UI labels, commands, model availability or compatibility claims.
- Verify time-sensitive technical facts against current authoritative sources when material.
- Clearly identify unofficial tooling as unofficial.

## Security
Never commit or display API keys, tokens, passwords, private credentials or authentication secrets. Scrub screenshots/examples of sensitive values.

## Web app delivery
- `index.html` is the repository/public entry point.
- Keep all required CSS, JavaScript, images/screenshots and assets inside the repository.
- Keep the extracted repository root directly deployable as a complete static site where applicable.
- Protected/Limited delivery is handled outside static files; never embed auth secrets in client assets.

## Escalation
Do not call for Astra for routine documentation/UI updates. Escalate only for root auth/delivery or major long-term repository/platform restructuring.

## Change control
Classify major proposals Maintain / Modify / Retire / Hold. Major changes require explicit user acceptance.

## Verification
Inspect the full diff, verify navigation/copy/progress/read-aloud behavior affected by changes, check mobile/desktop readability, and verify every changed command/instruction that can reasonably be tested. Report unverified claims explicitly.
