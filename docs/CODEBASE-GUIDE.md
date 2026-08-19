# Drenyra Skills — Codebase Guide

Maintainer-oriented map of this repository: where things live, what the invariants are, and how to verify a change. For the conceptual architecture, read [Architecture](architecture.md) and [Intended Usage](intended-usage.md) first.

> [!IMPORTANT]
> **Content, not runtime.** This repository holds versioned knowledge documents and their manifest — never code. Fiscal conventions apply wherever fiscal content appears: money is integer cents (BigInt), never floats; RUC/company/period scope is mandatory where fiscal context applies.

---

## Repository map

```text
skills/
  _template/skill.template.md   Authoring template + validation contract — start
                                every new skill from here, never invent a shape
  registry.json                 Registry manifest — authoring source of truth for
                                skill definitions (11 PE skills)
  registry.schema.json          Manifest contract (JSON Schema draft-07)
  pe/                           Peruvian jurisdiction knowledge documents
    conciliacion-bancaria.md    Bank reconciliation knowledge (full doc)
    igv-validate.md             IGV validation knowledge (full doc)
assets/branding/BRAND.md        Banner guide per the brand-system contract (v0.2)
docs/                           Documentation (intended-usage, CODEBASE-GUIDE,
                                architecture)
LICENSE                         Proprietary, © Arkelythex
```

The registry was introduced as slice 3 of the `drenyra-ecosystem-cleanup` effort: `skills/registry.json` here is the **authoring source of truth**; `drenyra-ai` ships the runtime copy (`BASE_PE_SKILLS` in `skills/pe.ts`) as a self-contained public surface.

---

## Layering (who may depend on whom)

```text
drenyra-skills/skills/            content (this repo) — versioned documents + manifest
        ▼ referenced by (never imported)
drenyra-ai/skills/                runtime — registry, checksum, signature, pinning
        ▼ consumed by
agents / missions                 runtime consumers (resolve skills at a date)
```

Rules that matter every day:

1. **Content never imports runtime.** A skill is a document with a schema — no code, no imports, no logic. This repo never depends on `drenyra-ai` internals.
2. **Runtime never depends on this repo.** `drenyra-ai` ships a self-contained copy (`BASE_PE_SKILLS`) and never reads this repo at runtime.
3. **The conformance gate keeps them honest.** `scripts/skills-conformance.mjs` in `drenyra-ai` compares this manifest against the shipped runtime on six fields (`version`, `jurisdiction`, `maxAutonomy`, `normativeSources`, `inputs`, `outputs`); any drift fails CI (`skills-conformance` job).
4. **Ecosystem direction.** Satellites consume published `drenyra-ai` contracts — never the reverse. Skills inform; they never authorize.
5. **No reverse flow into content.** Runtime outcomes (receipts, ledger) never change what the knowledge says.

---

## Where a change goes

| Kind of change | Lands in | Also update |
| --- | --- | --- |
| New skill | `skills/<domain>/<jurisdiction>/<topic>.md`, authored from `skills/_template/skill.template.md` | `skills/registry.json` entry, CHANGELOG |
| Normative edit to a skill | the skill document | version bump (semver) in doc **and** registry, CHANGELOG |
| Registry / format change | `skills/registry.json`, `skills/registry.schema.json`, `skills/_template/` | conformance check in `drenyra-ai`, CHANGELOG |
| Documentation | `docs/`, README | the documentation index in README |
| Branding assets | `assets/branding/BRAND.md` only | brand-conformance check in `drenyra-ai` (v0.2 palette) |
| License | never — `LICENSE` is fixed | — |

Every skill id, version, jurisdiction, `maxAutonomy`, `normativeSources`, `inputs`, and `outputs` in a document must match its `skills/registry.json` entry exactly.

---

## Invariants

These are checked during review. A change is **not done** until all hold:

- **Content is data.** No imports, no logic, no executable behavior in a skill.
- **No fabricated fiscal rules.** Every normative statement cites its source (norm, article, runbook); unreviewed documents are explicitly marked as drafts pending domain review.
- **Registry in lockstep.** The six conformance fields match the `drenyra-ai` runtime copy; `skills:conformance` passes.
- **Version discipline.** A normative change bumps the version in the document **and** in `registry.json` (semver). Skills are immutable during a mission — resolution at a historical date returns the version that was in force then (vigencia).
- **Autonomy is a ceiling.** `maxAutonomy` (R0–R3) caps what an agent may propose; it never grants approval. `R2`/`R3` skills (e.g. `pe.sire-filing`) require explicit human approval in the runtime.
- **Canonical shape stability.** The runtime hashes canonical (key-sorted) skill definitions (SHA-256 checksum) and verifies Ed25519-signed skill packs (SDD-070). Changing canonical fields casually breaks checksums and signatures.
- **Fiscal conventions.** Money is integer cents (BigInt), never floats; RUC/company/period scope is mandatory where fiscal context applies.
- **No AI attribution.** Conventional Commits only; no `Co-Authored-By` or "Generated with" markers.

---

## Validation

| Check | Command | What it proves |
| --- | --- | --- |
| Manifest schema | `npx ajv-cli validate -s skills/registry.schema.json -d skills/registry.json` (any draft-07 validator) | The registry entry satisfies the manifest contract |
| Conformance | `bun run skills:conformance` in a `drenyra-ai` checkout (sibling layout or `--manifest <path>`) | No drift between this manifest and the shipped runtime copy |
| Knowledge review | Manual, by a Peruvian accounting/tax professional | Normative claims are correct and cited |

The conformance gate is the load-bearing check: CI in `drenyra-ai` runs `bun run skills:conformance -- --manifest drenyra-skills/skills/registry.json` and fails the build on drift.

---

## Conventions

- **Conventional Commits**, no AI attribution. `feat|fix|docs|refactor|test|chore|ci|build|style|perf|revert(scope): message`.
- **One skill = one versioned document** plus its registry entry, in the same change.
- **Drafts are honest.** Unreviewed knowledge is marked `Status: draft from sources — pending domain review`.
- **Registry ids** match `^[a-z0-9][a-z0-9.-]*$`; versions match `^\d+\.\d+\.\d+$`; jurisdictions are two-letter codes (`PE` today); `maxAutonomy` is one of `R0`–`R3`.

---

## Read next

- [Architecture](architecture.md) — ecosystem position and skill lifecycle
- [Intended Usage](intended-usage.md) — what this repo is and is not
- [CONTRIBUTING](../CONTRIBUTING.md) — the contribution workflow
- `drenyra-ai/skills/` — the runtime modules that consume this content
