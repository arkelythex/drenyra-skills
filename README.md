# Drenyra Skills

**Versioned accounting, tax, and operational knowledge** for the Drenyra
ecosystem. Pre-alpha.

> [!IMPORTANT]
> **Private commercial product** — this repository is **private**; distribution
> of artifacts is contractual, never public. Use, copy, and distribution remain
> governed by the [LICENSE](LICENSE) (proprietary, © Arkelythex).

## Role in the ecosystem

Drenyra Skills is the **content** layer: versioned accounting/tax/operational
knowledge that agents and runtimes consume. It follows the Gentleman
Programming philosophy (content ≠ runtime):

- The **content** lives here: skills, rules, norms references, runbooks.
- The **runtime registry** (validation, loading, skills registry mechanics)
  lives in [`drenyra-ai/skills`](https://github.com/arkelythex/drenyra-ai/tree/main/skills)
  — the same split as Gentleman-Skills vs the agent runtime.

| Ecosystem project | Role | Status |
| --- | --- | --- |
| [Drenyra Command Center](https://github.com/arkelythex/drenyra-command-center) | Command Center (consumes) | In development (private) |
| [Drenyra AI](https://github.com/arkelythex/drenyra-ai) | Verifiable core (consumes skills) | Pre-alpha |
| [Drenyra Pi](https://github.com/arkelythex/drenyra-pi) | Pi-native harness (consumes, pinned) | Pre-alpha |
| [Drenyra Engram](https://github.com/arkelythex/drenyra-engram) | Institutional memory (used) | Pre-alpha |
| **Drenyra Skills** | Versioned accounting, tax, and operational knowledge | **This repo** |
| [Drenyra Guardian Angel](https://github.com/arkelythex/drenyra-guardian-angel) | Independent adversarial verification | In development |

**Direction rule:** skills are **content/data** — referenced by the
`drenyra-ai` runtime, consumed by agents, and informed by Drenyra Engram. This
repo never depends on `drenyra-ai` internals; a skill is a versioned document
with a schema, not code.

### Drenyra Dominion Program

Drenyra Skills is one vertical inside the
[Drenyra Dominion Program](https://github.com/arkelythex/drenyra-ai/tree/main/openspec/programs/drenyra-dominion),
the federated program master that fixes vision, authority, contracts,
dependencies, gates, and sequencing across every Drenyra repository. A single
master SDD governs the ecosystem; implementable vertical SDDs deliver complete
capabilities that may traverse the repositories they need while each
repository preserves its own ownership and boundaries.

| Program vertical | This repo's role |
| --- | --- |
| [SDD-070 — Skills and Policy Supply Chain](https://github.com/arkelythex/drenyra-ai/tree/main/openspec/programs/drenyra-dominion/sdds/sdd-070-skills) | Skills and policy supply chain: versioned fiscal skills, normative sources, vigencia, checksum, signature, rollback |
| SDD-050 — Peruvian Monthly Close | Feeds — the close journey consumes pinned skills and policies |

**Immutability rule:** skills are immutable during a mission — updates affect
new missions, never rewrite the past. **Content rule:** skills are content,
never authority.

## Structure

```text
skills/                       versioned knowledge (the content)
  _template/                  skill format template + validation contract
  registry.json               manifest — authoring source of skill definitions
  registry.schema.json        manifest contract (draft-07)
  <domain>/<jurisdiction>/    e.g. pe/igv-validate.md
    <topic>.md                one skill = one versioned document
LICENSE                       proprietary, © Arkelythex
```

**Ownership model (slice 3 of `drenyra-ecosystem-cleanup`):**
`registry.json` here is the **authoring source of truth** for the skill
registry. `drenyra-ai` ships the runtime copy (`BASE_PE_SKILLS` in
`skills/pe.ts`) as part of its standalone `./skills` public surface — it must
stay self-contained and never depend on this repo. `bun run skills:conformance`
in `drenyra-ai` fails CI on any drift between this manifest and the shipped
runtime. Long-form knowledge docs (`skills/<domain>/<jurisdiction>/`) are
authored here against their normative sources.

## Brand

All assets follow the [brand-system](https://github.com/arkelythex/drenyra-ai/blob/main/contracts/brand-system.md)
contract (v0.2 — dark + light themes, cyan/violet accents). Banner prompts:
[`gpt-image-prompts.md`](https://github.com/arkelythex/drenyra-ai/blob/main/docs/assets/brand/gpt-image-prompts.md).

Proprietary. © 2026 Arkelythex. All rights reserved.
