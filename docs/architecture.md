# Drenyra Skills — Architecture

> **Last updated:** 2026-08-19.

## Documentation index

| Doc | What it covers | Read when |
| --- | --- | --- |
| [Intended Usage](intended-usage.md) | What this repo is and is not; the content vs. runtime frontier | Starting out — read this first |
| [Codebase Guide](CODEBASE-GUIDE.md) | Repository map, layering, where changes go, invariants, validation | Navigating or changing the repo |
| [README](../README.md) | Positioning, skills table, quick start | Consuming or discovering the repo |

## Position in the ecosystem

Drenyra Skills is the **content layer** of the Drenyra ecosystem: versioned, jurisdiction-scoped fiscal knowledge (PE) that the `drenyra-ai` runtime validates and pins. Dependency direction follows the ecosystem rule — satellites consume the published `drenyra-ai` contracts, never the reverse:

```text
                    ┌──────────────────────────┐
                    │ drenyra-ai (runtime)     │  Alpha v0.5.0 — verifiable core
                    │ registry · checksum ·    │  registry, checksum (SHA-256),
                    │ signature · pinning      │  signature (Ed25519), pinning
                    └───────────▲──────────────┘
                                │ consumes & validates · skills:conformance CI gate
                    ┌───────────┴──────────────┐
                    │ drenyra-skills (content) │  In development — this repo
                    │ versioned knowledge (PE) │  never depends on runtime internals
                    └──────────────────────────┘
                                │ referenced by
                    ┌───────────┴──────────────┐
                    │ agents / missions        │  resolve skills at a date (vigencia)
                    └──────────────────────────┘
```

**Direction of dependencies:** this repo never depends on `drenyra-ai` internals; `drenyra-ai` ships a self-contained runtime copy (`BASE_PE_SKILLS`) and never depends on this repo at runtime. The `skills:conformance` gate in `drenyra-ai` CI pins the two together — any drift between the authoring manifest and the shipped runtime fails the build.

**Authority:** knowledge informs; it never authorizes. The authority chain stays with the ecosystem: the Drenyra accounting database is transactional truth, Engram informs (never authorizes), receipts and the ledger are execution proof (Ed25519-signed, append-only), Guardian Angel verifies independently, and the **human accountant is the final authority**. `maxAutonomy` on a skill is a ceiling on what an agent may propose — never a grant.

## Core invariants

1. **Content is data, not code.** Skills are versioned documents with a schema — no imports, no logic, no executable behavior.
2. **Every normative claim cites its source.** No fabricated fiscal rules, norms, rates, or references.
3. **Registry is the authoring source of truth.** The six conformance fields (`version`, `jurisdiction`, `maxAutonomy`, `normativeSources`, `inputs`, `outputs`) stay in lockstep with the runtime copy.
4. **Skills are immutable during a mission.** Resolution at a historical date returns the version in force then (vigencia); updates affect new missions, never the past.
5. **Autonomy is bounded, approval is human.** `R0`/`R1` controlled autonomy, `R2`/`R3` explicit human approval; skills never approve.
6. **Fiscal discipline.** Money is integer cents (BigInt), never floats; RUC/period scope is mandatory where fiscal context applies.

## Content model

A skill has two faces, both authored here and kept in lockstep:

1. **The definition** — the machine contract in `skills/registry.json` (schema: `skills/registry.schema.json`, draft-07): `id`, `version`, `jurisdiction`, `maxAutonomy`, `normativeSources`, `inputs`, `outputs`.
2. **The knowledge document** — `skills/<domain>/<jurisdiction>/<topic>.md` from the template: frontmatter (id, version, domain, jurisdiction, title, scope, tags, effective dates, sources) plus `Purpose`, `Rules` (cited), `Operational steps`, and `References`.

At runtime (`drenyra-ai/skills/`), a definition is hashed over its canonical key-sorted JSON (SHA-256 checksum), optionally shipped in an Ed25519-signed skill pack, and bound into an immutable mission skill pin (`{id, version, checksum, jurisdiction, vigencia}`) — SDD-070. None of that machinery exists in this repo; it consumes nothing and ships nothing executable.

## Layer model

```text
content layer (this repo)        skills/, registry.json, _template/ — versioned knowledge
        ▼ referenced by
validation layer (drenyra-ai)     skills module: registry · checksum · signature · pinning
        ▼ consumed by
runtime consumers                 agents and missions resolve skills at a date
        ▼
authority                         gates · approvals · receipts · human accountant (final)
```

## Skill lifecycle

1. **Author** — copy `skills/_template/skill.template.md` into `skills/<domain>/<jurisdiction>/<topic>.md`; fill frontmatter and body with cited rules.
2. **Register** — add the definition to `skills/registry.json`; it must satisfy the schema and match the document.
3. **Validate** — `skills:conformance` in `drenyra-ai` must pass (no drift with `BASE_PE_SKILLS`); unreviewed docs stay marked as drafts pending domain review.
4. **Ship** — the runtime copy updates in `drenyra-ai`; the versioned definition becomes resolvable.
5. **Resolve** — a mission resolves the skill in force at its reference date (vigencia).
6. **Pin** — the resolved set is pinned immutably for the mission: checksum + signature + `{id, version, checksum, jurisdiction, vigencia}`.
7. **Supersede** — a normative change bumps the version; new missions resolve the new version; completed missions keep the pinned one.

## Consumer contract

- Consumers (`drenyra-ai`, agents) consume **versioned definitions** — the manifest and knowledge documents — never an unversioned checkout.
- The runtime copy is self-contained: consumers never read this repo at runtime.
- Conformance is the coordination surface: the gate pins the shipped copy to this authoring manifest.
- A skill declares its `inputs` and `outputs` so consumers can wire it into evidence and candidates; it declares `maxAutonomy` so the runtime applies the right review tier — but the skill itself never authorizes anything.

## Repository scope

This repo is the **content layer only**. It does **not** contain the runtime registry, checksum, signature, or pinning machinery (that is `drenyra-ai/skills/`), the product UI (that is `drenyra-command-center`), a Pi harness (that is `drenyra-pi`), a memory engine (that is `drenyra-engram`), or independent verification (that is `drenyra-guardian-angel`). It also does not contain the ERP, the books of record, or any SUNAT/bank integration — those connect through adapters and evidence, never through skills.
