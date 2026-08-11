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

## Structure

```text
skills/                       versioned knowledge (the content)
  _template/                  skill format template + validation contract
  <domain>/<jurisdiction>/    e.g. tax/pe, close/monthly-close
    <topic>.md                one skill = one versioned document
registry.schema.json          machine-readable skill manifest contract
LICENSE                       proprietary, © Arkelythex
```

The skill format (frontmatter + body) is defined in
[`skills/_template/skill.template.md`](skills/_template/skill.template.md).
Versioning follows the ecosystem convention: skills are immutable once
referenced; updates are new versions, never in-place edits to frozen content.

## Brand

All assets follow the [brand-system](https://github.com/arkelythex/drenyra-ai/blob/main/contracts/brand-system.md)
contract (v0.2 — dark + light themes, cyan/violet accents). Banner prompts:
[`gpt-image-prompts.md`](https://github.com/arkelythex/drenyra-ai/blob/main/docs/assets/brand/gpt-image-prompts.md).

Proprietary. © 2026 Arkelythex. All rights reserved.
