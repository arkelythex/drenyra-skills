# Drenyra Skills

**Versioned accounting, tax, and operational knowledge for the Drenyra ecosystem — the content layer that agents consume and the `drenyra-ai` runtime validates and pins.** One source of truth for jurisdiction-scoped fiscal knowledge (Peru today): authored once, versioned per skill, and kept in conformance with the runtime that ships it.

> [!IMPORTANT]
> **Status: In development — public repository.** No released versions yet; content is versioned per skill through the registry manifest (`skills/registry.json`). This repository is **publicly visible** as part of the Drenyra ecosystem; use, copy, and distribution remain governed by the [LICENSE](LICENSE) (proprietary, © Arkelythex). Knowledge docs under `skills/pe/` are drafts from cited sources, pending domain review by a Peruvian accounting professional before normative use.

---

## Quick Start

Drenyra Skills is a **content** repository — there is nothing to install. You read it to understand the knowledge the ecosystem runs on, or you author skills that the `drenyra-ai` runtime consumes.

### Inspect the skills

```bash
git clone https://github.com/arkelythex/drenyra-skills.git
cd drenyra-skills
```

| Step | What to look at |
| --- | --- |
| The manifest | `skills/registry.json` — authoring source of truth: every skill id, version, jurisdiction, `maxAutonomy`, normative sources, inputs, and outputs |
| The manifest contract | `skills/registry.schema.json` — JSON Schema (draft-07) that `registry.json` must satisfy |
| A knowledge document | `skills/pe/conciliacion-bancaria.md` — a full skill: frontmatter, purpose, rules with cited sources, operational steps, references |
| The authoring template | `skills/_template/skill.template.md` — the format every new skill follows |
| The runtime contract | [`drenyra-ai/skills/`](https://github.com/arkelythex/drenyra-ai/tree/main/skills) — registry, checksum, signature, and pinning modules that consume this content |

### Validate the manifest

```bash
# Any JSON Schema draft-07 validator, e.g. with a Node one-liner via ajv:
npx ajv-cli validate -s skills/registry.schema.json -d skills/registry.json
```

### As an ecosystem consumer

The `drenyra-ai` runtime ships a self-contained copy of the PE skill definitions (`BASE_PE_SKILLS`) and pins them to this manifest through the `skills:conformance` CI gate — any drift between this repo and the shipped runtime fails CI in `drenyra-ai`:

```bash
# in a drenyra-ai checkout, with this repo as a sibling (or --manifest <path>)
bun run skills:conformance
```

---

## What It Contains

Eleven Peruvian (PE) skills are defined in the registry, each capped by a maximum autonomy tier (`maxAutonomy`): `R0`/`R1` run with controlled autonomy, `R2` requires explicit approval — the ceiling is a limit, never a grant. Two skills currently ship a long-form knowledge document under `skills/pe/` (marked ✓).

| Skill | Version | Max autonomy | Normative basis | Role |
| --- | --- | --- | --- | --- |
| `pe.igv-validate` ✓ | 1.0.0 | R1 | TUO IGV — D.S. 055-99-EF | Validates IGV treatment on an invoice (gravada / exonerada / inafecta, rate and base) |
| `pe.sire-compare` | 1.0.0 | R1 | SUNAT SIRE — R.S. 085-2020/SUNAT | Compares SIRE proposals against the ledger; surfaces exceptions as candidates |
| `pe.detraction-check` | 1.0.0 | R1 | D.S. 155-98-EF | Validates detracciones treatment for an operation and period |
| `pe.retention-check` | 1.0.0 | R1 | D.S. 56-97-EF | Validates IGV retentions for an operation and supplier |
| `pe.perception-check` | 1.0.0 | R1 | D.S. 122-94-EF | Validates IGV perceptions for an operation and customer |
| `pe.sire-filing` | 1.0.0 | R2 | SUNAT SIRE — R.S. 085-2020/SUNAT | Assesses SIRE filing readiness (approval-gated) |
| `pe.conciliacion-bancaria` ✓ | 1.0.0 | R1 | PCGE (R. SMV 043-2010-SMV/01), NIC 1, Código Tributario | Bank reconciliation: normalize, match, classify differences, adjustment drafts |
| `pe.depreciacion-activo-fijo` | 1.0.0 | R1 | PCGE, LIR (D.S. 179-2004-EF) | Fixed-asset depreciation entries per policy and scope |
| `pe.provision-cartera` | 1.0.0 | R1 | PCGE, LIR, Código Tributario | Portfolio and inventory provision entries |
| `pe.isr-mensual` | 1.0.0 | R1 | LIR — Art. 85 | Monthly income tax entry and cédula |
| `pe.cierre-resultados` | 1.0.0 | R1 | PCGE, NIC 1 | Closing entries to result accounts |

<details>
<summary><strong>How a skill is structured</strong></summary>

One skill is one versioned knowledge document — content, not code. The template (`skills/_template/skill.template.md`) defines the shape:

- **Frontmatter** — id, version, domain, jurisdiction, title, scope (RUC/company/period where fiscal context applies), tags, effective dates, and normative sources.
- **Body sections** — `Purpose`, `Rules` (each normative statement cites its source), `Operational steps` (deterministic, reviewable as candidates), and `References`.

Runtime-facing definitions live in the registry manifest: id, version, jurisdiction, `maxAutonomy`, `normativeSources`, `inputs`, `outputs` — the six fields the conformance gate pins against `drenyra-ai`.
</details>

---

## Role in the ecosystem

Drenyra Skills is the **content** layer of the Drenyra ecosystem. It follows the same split as Gentle-AI vs. its runtime: content and runtime are separate, versioned, and never coupled:

- **The content lives here** — skills, rules, norms references, operational knowledge.
- **The runtime lives in [`drenyra-ai/skills/`](https://github.com/arkelythex/drenyra-ai/tree/main/skills)** — registry, checksum (SHA-256 over canonical definitions), Ed25519 signature verification, and mission skill pinning (SDD-070).

| Ecosystem project | Role | Status |
| --- | --- | --- |
| [Drenyra AI](https://github.com/arkelythex/drenyra-ai) | Verifiable core — runtime that validates and pins skills | Alpha (v0.5.0) |
| [Drenyra Command Center](https://github.com/arkelythex/drenyra-command-center) | Command Center web application (consumes) | In development |
| [Drenyra Pi](https://github.com/arkelythex/drenyra-pi) | Pi-native harness (consumes, pinned) | Pre-alpha |
| [Drenyra Engram](https://github.com/arkelythex/drenyra-engram) | Institutional memory — informs, never authorizes | Alpha (v0.2.1) |
| **Drenyra Skills** | Versioned accounting, tax, and operational knowledge | **This repo — In development** |
| [Drenyra Guardian Angel](https://github.com/arkelythex/drenyra-guardian-angel) | Independent, adversarial, continuous verification | In development |

**Direction rule:** skills are content — referenced by the `drenyra-ai` runtime, consumed by agents, and informed by Drenyra Engram. This repo never depends on `drenyra-ai` internals; a skill is a versioned document with a schema, not code. `drenyra-ai` ships its own self-contained runtime copy and never depends on this repo; the `skills:conformance` gate keeps the two in lockstep.

**Authority model:** Drenyra Skills **informs; it never authorizes**. `maxAutonomy` caps what an agent may propose; approvals, gates, and the human accountant remain the final authority. Skills are immutable during a mission — a normative update affects new missions, never rewrites the past.

### Drenyra Dominion Program

Drenyra Skills is one vertical inside the [Drenyra Dominion Program](https://github.com/arkelythex/drenyra-ai/tree/main/openspec/programs/drenyra-dominion), the federated program master that fixes vision, authority, contracts, dependencies, gates, and sequencing across every Drenyra repository.

| Program vertical | This repo's role |
| --- | --- |
| [SDD-070 — Skills and Policy Supply Chain](https://github.com/arkelythex/drenyra-ai/tree/main/openspec/programs/drenyra-dominion/sdds/sdd-070-skills) | Skills and policy supply chain: versioned fiscal skills, normative sources, vigencia, checksum, signature, rollback |
| SDD-050 — Peruvian Monthly Close | Feeds — the close journey consumes pinned skills and policies |

---

## Repository layout

```text
skills/                       versioned knowledge (the content)
  _template/skill.template.md skill authoring template + validation contract
  registry.json               manifest — authoring source of truth
  registry.schema.json        manifest contract (JSON Schema draft-07)
  pe/                         Peruvian jurisdiction knowledge documents
    conciliacion-bancaria.md
    igv-validate.md
assets/branding/BRAND.md      banner guide per the brand-system contract (v0.2)
LICENSE                       proprietary, © Arkelythex
```

---

## Documentation

| Your task | Start here |
| --- | --- |
| Understand what this repo is and is not | [Intended Usage](docs/intended-usage.md) |
| Navigate the repository as a maintainer | [Codebase Guide](docs/CODEBASE-GUIDE.md) |
| Understand the ecosystem position and skill lifecycle | [Architecture](docs/architecture.md) |
| Author or change a skill | [CONTRIBUTING](CONTRIBUTING.md) and the [AI Policy](AI_POLICY.md) |

---

## Next Steps

- **New to the ecosystem?** Read the [Intended Usage](docs/intended-usage.md) — content vs. runtime, and what this repo will never be.
- **Authoring a skill?** Copy `skills/_template/skill.template.md`, fill the frontmatter and sections, register the definition in `skills/registry.json`, and follow [CONTRIBUTING](CONTRIBUTING.md) — including the `skills:conformance` gate.
- **Consuming skills?** Read the [Architecture](docs/architecture.md) for the consumer contract, then see [`drenyra-ai/skills/`](https://github.com/arkelythex/drenyra-ai/tree/main/skills) for the runtime modules.
- **Contributing?** Read [CONTRIBUTING](CONTRIBUTING.md) and the [AI Policy](AI_POLICY.md) first.

---

Proprietary. © 2026 Arkelythex. All rights reserved. See [LICENSE](LICENSE).
