# Drenyra Skills — Agent Guide

This file is for AI agents and their humans working in this repository. It answers: *what are the non-negotiable rules, what should I read first, and where do changes belong?*

> [!IMPORTANT]
> **Content, not runtime.** Drenyra Skills is the versioned knowledge layer of the Drenyra ecosystem. Skills are documents with a schema — never code, never authority. The runtime that validates, checksums, signs, and pins them lives in `drenyra-ai`.

## Non-Negotiable Rules

Every change — skills, registry entries, docs, or CI — must respect these. They exist because this content drives fiscal behavior in production missions.

1. **Content is data, not code.** No imports, no logic, no executable behavior in a skill. A skill is a versioned knowledge document: rules, references, and operational steps.
2. **Never fabricate fiscal rules.** Every normative claim must cite its source (SUNAT norm, legal text, internal runbook). Do not invent skills, norms, articles, rates, or references. A skill without a source is a defect.
3. **Registry is the authoring source of truth.** `skills/registry.json` defines every skill id, version, jurisdiction, `maxAutonomy`, `normativeSources`, `inputs`, and `outputs`. The six conformance fields must stay in sync with the `drenyra-ai` runtime copy (`BASE_PE_SKILLS`) — drift fails the `skills:conformance` CI gate.
4. **Version everything; never rewrite the past.** A normative change bumps the skill version (semver). Skills are immutable during a mission: updates affect new missions, never missions already in flight.
5. **Jurisdiction and fiscal conventions.** Current scope is PE. Where fiscal context applies, RUC/company/period scope is mandatory; money is integer cents (BigInt), never floats; sequence/version fields are JSON integers, never floats.
6. **Skills inform; they never authorize.** `maxAutonomy` (R0–R3) is a ceiling on what an agent may propose — never a grant. Approvals, gates, and the human accountant remain the final authority.
7. **Keep the canonical shape stable.** The runtime computes SHA-256 checksums over canonical (key-sorted) skill definitions and verifies Ed25519-signed skill packs (SDD-070). Changing the canonical shape casually breaks checksums and signatures.
8. **No AI attribution.** Conventional Commits only. No `Co-Authored-By`, `Reviewed-by`, or "Generated with" markers.
9. **No invented status.** This repository is **public** and **In development**. Do not claim releases, versions, badges, or license facts that do not exist.

## Read Before Working

| Goal | Start here |
| --- | --- |
| Understand what this repo is and is not | [Intended Usage](docs/intended-usage.md) |
| The skill format and how to author one | [CONTRIBUTING](CONTRIBUTING.md) and `skills/_template/skill.template.md` |
| The manifest and its contract | `skills/registry.json`, `skills/registry.schema.json` |
| Repository layout and invariants | [Codebase Guide](docs/CODEBASE-GUIDE.md) |
| Ecosystem position and lifecycle | [Architecture](docs/architecture.md) |
| Rules for AI-assisted contribution | [AI Policy](AI_POLICY.md) |

## Where Changes Belong

```text
skills/_template/skill.template.md   Authoring template + validation contract
skills/registry.json                 Registry manifest — authoring source of truth
skills/registry.schema.json          Manifest contract (JSON Schema draft-07)
skills/<domain>/<jurisdiction>/      Knowledge documents, e.g. skills/pe/*.md
assets/branding/BRAND.md             Banner guide per the brand-system contract
docs/                                Documentation (intended-usage, CODEBASE-GUIDE, architecture)
```

- A **new skill** goes in `skills/<domain>/<jurisdiction>/<topic>.md`, authored from the template, **and** registered in `skills/registry.json` — in the same change.
- A **normative edit** to a skill bumps its version in the document and in `registry.json`, and updates the CHANGELOG.
- A **registry or format change** touches `skills/registry.json`, `skills/registry.schema.json`, and the template together — and must be validated against the `skills:conformance` gate.
- A **docs change** goes in `docs/` or the README, with the documentation index updated.
- **Never** modify `LICENSE`, `assets/` beyond the branding guide, or any file outside the listed surfaces without explicit authorization.

## Skills

Load the relevant skill **before** authoring or editing content in this repository:

- **skill-creator** — LLM-first skill authoring with valid frontmatter (frontmatter contract: `name`-equivalent id, version, description in one quoted YAML-safe line; imperative instructions; supporting material in references, not the body). This repo's own `skills/_template/skill.template.md` is the normative local format and outranks generic guidance.
- **cognitive-doc-design** — documentation structure that reduces cognitive load (lead with the answer, progressive disclosure, tables over prose) for any `docs/` or README work.

When a task touches fiscal content, resolve the matching Drenyra skill in the ecosystem registry and read its exact `SKILL.md` before writing — the same discipline `drenyra-ai` applies to code agents.
