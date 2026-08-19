# Intended Usage — Drenyra Skills

> [!IMPORTANT]
> **Content, not runtime.** Drenyra Skills is the versioned knowledge layer of the Drenyra ecosystem: jurisdiction-scoped accounting, tax, and operational knowledge (Peru today). It contains **what agents should know** — never the machinery that loads, validates, or executes it.

> **The institutional thesis:** the knowledge informs; the runtime validates; the professional decides; the evidence remains.

## Definition

**Drenyra Skills is the content repository of the Drenyra ecosystem: versioned, jurisdiction-scoped knowledge documents that agents consume and the `drenyra-ai` runtime validates and pins.**

It is the same split Gentle-AI applies between content and runtime, translated to the fiscal domain:

- **Content lives here** — skills (one skill = one versioned knowledge document), rules with cited normative sources, operational steps, references.
- **Runtime lives in `drenyra-ai`** — the skills module (`registry`, `pinning`, `signature`, `pe.ts`) that validates definitions, computes checksums, verifies Ed25519-signed skill packs, and pins immutable skill sets per mission (SDD-070).

## The philosophy, translated

| Gentle-AI concept | Drenyra Skills translation |
| --- | --- |
| Skills specialize the agent | Skills give agents jurisdiction-scoped fiscal knowledge |
| Skills registry | The authoring manifest `skills/registry.json` |
| Content versioned | Each skill carries a semver version and validity window (vigencia) |
| Content ≠ runtime | Knowledge docs here; registry/checksum/signature/pinning in `drenyra-ai` |
| Registry pinned by CI | `skills:conformance` fails CI on drift between this manifest and the shipped runtime |
| Reviews gate delivery | Domain review by a Peruvian accounting professional before knowledge becomes normative |

## The golden rule

> [!IMPORTANT]
> **Skills inform; they never authorize.** `maxAutonomy` (R0–R3) is a ceiling on what an agent may propose — never a grant. Approvals, gates, receipts, and the human accountant remain the final authority. A skill can never approve, sign, or execute anything.

## What Drenyra Skills is not

| Not this | Because |
| --- | --- |
| The runtime | Loading, validation, checksum, signature, and pinning live in `drenyra-ai` |
| The registry of record | `drenyra-ai` ships its own self-contained runtime copy; this manifest is the **authoring** source of truth, kept in sync by the conformance gate |
| Code | Skills are documents with a schema — no imports, no logic, no executable behavior |
| The fiscal authority | Knowledge never approves, authorizes, or executes; professionals and gates decide |
| Legal or tax advice | Knowledge cites sources but is not advice; unreviewed docs are explicitly drafts |
| The ERP or the books of record | Those live in Drenyra Command Center and external systems |
| Institutional memory | That is Drenyra Engram — informs, never authorizes |
| A privileged gateway to SUNAT/banks/ERPs | External systems connect through adapters and evidence, never through skills |

## The responsibility split

| Component | Role |
| --- | --- |
| **Drenyra Skills** | Versioned accounting, tax, and operational knowledge (content) |
| **Drenyra AI** | Runtime: registry, checksum, signature, pinning; validates and consumes skills (Alpha v0.5.0) |
| **Drenyra Command Center** | Professional interface (consumes) |
| **Drenyra Pi** | Pi-native harness (consumes, pinned) |
| **Drenyra Engram** | Institutional memory — informs, never authorizes |
| **Drenyra Guardian Angel** | Independent, adversarial, continuous verification |
| **Human accountant** | Final authority: reviews knowledge, approves actions |

## The target experience

A professional runs a monthly close. The runtime resolves the pinned PE skills at the right date, the agent applies their rules, and **every fiscal claim the agent makes traces to a cited normative source in this repository**. When the law changes, a contributor bumps the affected skill's version here; the runtime ships the update; new missions run on it — and completed missions keep the version that was in force when they ran.

## Frontier rules

1. **Content is data, not code.** No logic in a skill; a skill is a versioned document.
2. **Every normative claim cites its source.** Never fabricate rules, norms, articles, rates, or references.
3. **Version everything; never rewrite the past.** Skills are immutable during a mission; updates affect new missions only.
4. **Registry in lockstep with the runtime.** The six conformance fields (`version`, `jurisdiction`, `maxAutonomy`, `normativeSources`, `inputs`, `outputs`) must match `drenyra-ai`'s `BASE_PE_SKILLS` — drift fails CI.
5. **Skills inform; they never authorize.** `maxAutonomy` is a ceiling, never a grant.
6. **Fiscal discipline.** Money is integer cents (BigInt), never floats; RUC/period scope is mandatory where fiscal context applies.

## Quick path

1. Read the [repository layout](../README.md#repository-layout) and the registry `skills/registry.json`.
2. Read one full knowledge document, e.g. `skills/pe/conciliacion-bancaria.md`, to see the format.
3. Read the [Architecture](architecture.md) for the ecosystem position and the skill lifecycle.

## Next steps

- The ecosystem position and lifecycle → [Architecture](architecture.md)
- The repository map and invariants → [Codebase Guide](CODEBASE-GUIDE.md)
- How to contribute → [CONTRIBUTING](../CONTRIBUTING.md)
- The project overview → [README](../README.md)
