# Codex Web GPT Beginner Guide Master Architecture

Status: approved baseline consolidated by Sol; Astra architecture review pending
Last updated: 2026-09-07

## 1. Product architecture
A static HTML/CSS/JavaScript manual designed to be deployable directly from the repository root. `index.html` is the entry point; interaction features such as expansion/copy/progress/read-aloud remain client-side where practical.

## 2. Content architecture
Organize instructions as ordered procedures with explicit prerequisites, action, expected result and recovery/troubleshooting. Content should remain separable enough from UI behavior that technical instructions can be updated without redesigning the entire app.

## 3. Accuracy boundary
The guide may describe unofficial tooling but must label it as such. Claims that can change with current software/model/API/Cloudflare/OpenAI behavior require fresh authoritative verification before material updates.

## 4. Security boundary
No secrets in source, screenshots, examples, logs or generated instructions. Redact tokens/credentials and avoid teaching users to commit secret values.

## 5. Distribution boundary
The repository can remain a complete static package. Public-source/GitHub-Pages capability does not imply every distributed manual instance must be public. My Hub/Cloudflare may provide a Limited authenticated delivery layer without embedding auth secrets into the static app.

## 6. Governance
- Astra: protected-delivery/auth model, major repository/product restructuring, irreversible platform choices.
- Sol: information architecture, tutorial writing, technical verification, UI/UX, bounded features and Codex tasks.
- Codex: scoped static-site implementation/tests.

## 7. Escalation
Astra review is required only when changing the core protected-delivery/auth architecture or making a long-term structural platform decision. Routine documentation updates and current-version corrections remain Sol work.
