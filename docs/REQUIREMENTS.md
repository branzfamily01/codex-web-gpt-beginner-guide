# Codex Web GPT Beginner Guide Requirements

Status: current approved baseline, 2026-09-07

## Purpose
A beginner-friendly HTML manual that helps non-expert users install and operate Codex Web GPT-related tooling by following clear screen/PowerShell steps without assuming GitHub, terminal or Cloudflare expertise.

## Teaching/UX requirements
Each important procedure should explain:
- why the step is needed
- exactly where to click/type
- what success looks like
- what to do when the expected result does not appear

The manual must work on desktop and remain readable on mobile. Users should be able to keep track of their current step and return to the guide/manual easily.

## Technical-content requirements
- Codex Web GPT is unofficial tooling; distinguish it from official OpenAI products.
- Time-sensitive installation/model/CLI/API information must be verified against current authoritative sources before publication when material.
- Do not invent UI labels, commands or compatibility claims.
- Screenshots/examples must never contain API keys, tokens, credentials, personal paths containing secrets, or other sensitive data.

## Delivery requirements
- Repository root is a complete static web project with `index.html` as the public entry point and all CSS/JS/assets included.
- The source can remain a GitHub Pages-capable static package even when an authenticated Limited copy is delivered through My Hub/Cloudflare.
- Protected distribution and source-code structure are separate concerns.

## Governance
Astra owns any major protected-delivery/auth architecture or fundamental product/repository redesign. Sol owns tutorial content, information architecture, UX, update/research work and Codex specifications. Codex implements scoped static-site changes.
