# Contributing to Drenyra Skills

Thank you for your interest in contributing to **Drenyra Skills** — the versioned accounting, tax, and operational knowledge layer (PE jurisdiction) of the Drenyra ecosystem.

> [!IMPORTANT]
> **Content, not runtime — and fiscal correctness is a product safety requirement.** Skills are versioned knowledge documents with a schema, never code. Never fabricate a fiscal rule: every normative claim must cite its source (norm, article, or runbook). Registry drift from the `drenyra-ai` runtime fails CI.

Before you dive in, read this guide fully. We have a structured workflow to keep the knowledge — and the ecosystem's fiscal guarantees — organized and maintainable.

---

## Table of Contents

- [Issue-First Workflow](#issue-first-workflow)
- [Looking for Something to Work On](#looking-for-something-to-work-on)
- [AI-Assisted Contributions](#ai-assisted-contributions)
- [Ground Rules](#ground-rules)
- [How to Author a Skill](#how-to-author-a-skill)
- [Development Setup](#development-setup)
- [Validation](#validation)
- [Commit Convention](#commit-convention)
- [Branch Naming](#branch-naming)
- [Pull Request Rules](#pull-request-rules)
- [Code of Conduct](#code-of-conduct)
- [Questions?](#questions)

---

## Issue-First Workflow

**No PR without an issue. No exceptions.**

This project follows a strict issue-first workflow:

1. **Open an issue** (bug report or feature request) describing the skill, rule, or registry change.
2. **Wait for approval** — a maintainer adds the `status:approved` label when the issue is ready to be worked on.
3. **Comment on the issue** to let others know you are working on it.
4. **Open a PR** referencing the approved issue with `Closes #<N>`.

PRs that are not linked to an issue will be rejected by maintainers during review.

For knowledge changes, the issue should state the **skill** (or the need for a new one), the **normative source** it relies on, and — for fiscal behavior — the jurisdiction and any RUC/company and period scope. Fiscal knowledge is reviewed with evidence, not guesses.

---

## Looking for Something to Work On?

Issues labelled `good first issue` are scoped, low-risk entry points; issues labelled `help wanted` want contribution. Comment that you are taking one and go.

An issue **without** `status:approved` is usually still in discussion — implementing before the decision lands means the work gets thrown away.

---

## AI-Assisted Contributions

**AI assistance is allowed, but you must understand and own the complete submission.** Before opening a PR:

- [ ] Confirm the change matches the approved issue scope.
- [ ] Inspect every changed line.
- [ ] Verify every normative claim against its cited source; remove invented, unverifiable, or unrelated output.
- [ ] Confirm the registry entry (id, version, jurisdiction, `maxAutonomy`, `normativeSources`, `inputs`, `outputs`) matches the skill document.
- [ ] Confirm the version discipline: a normative change bumps the version in the document **and** in `registry.json`.
- [ ] Run applicable validation and report the actual outcomes.
- [ ] Be ready to explain the design and tradeoffs.
- [ ] Disclose material AI assistance in the PR.

For disclosure boundaries, required details, attribution rules, and reviewer expectations, see the canonical [AI-Assisted Contribution Policy](AI_POLICY.md).

---

## Ground Rules

These are the non-negotiable rules for every contribution. They are also enforced during review.

- **Content is data, not code.** No imports, no logic, no executable behavior in a skill.
- **Never fabricate fiscal rules.** Every normative statement cites its source; no invented skills, norms, articles, rates, or references.
- **Registry is the authoring source of truth.** `skills/registry.json` defines every skill; the six conformance fields (`version`, `jurisdiction`, `maxAutonomy`, `normativeSources`, `inputs`, `outputs`) must stay in sync with the `drenyra-ai` runtime copy.
- **Version everything; never rewrite the past.** A normative change bumps the skill version (semver). Skills are immutable during a mission.
- **Jurisdiction and fiscal conventions.** Current scope is PE. Where fiscal context applies, RUC/company/period scope is mandatory; money is integer cents (BigInt), never floats.
- **Skills inform; they never authorize.** `maxAutonomy` is a ceiling, never a grant.
- **Docs-as-code.** Update docs in the same PR as the change. Stale docs are a bug.
- **No AI attribution.** Conventional Commits only; no `Co-Authored-By` or "Generated with" markers.

---

## How to Author a Skill

One skill is one versioned knowledge document. The template (`skills/_template/skill.template.md`) is the normative format; start from it — never invent a new shape.

1. **Copy the template** to `skills/<domain>/<jurisdiction>/<topic>.md` (today: `skills/pe/<topic>.md`).
2. **Fill the frontmatter:** `id`, `version` (`x.y.z`), `domain`, `jurisdiction`, `title` (imperative), `scope` (RUC/company/period where fiscal context applies — mandatory), `tags`, `effective` dates, and `sources`. Keep `version: 0.0.0`-style drafts honest until reviewed.
3. **Write the body:** `Purpose`, `Rules` (each rule is a normative statement **with its source**), `Operational steps` (deterministic, verifiable order, each step reviewable as a candidate), and `References`.
4. **Register the definition** in `skills/registry.json`: id, version, jurisdiction, `maxAutonomy` (one of `R0`–`R3`), `normativeSources`, `inputs`, `outputs`. The entry must satisfy `skills/registry.schema.json` and match the document.
5. **Validate** (see [Validation](#validation)) — including the `skills:conformance` gate in `drenyra-ai`, which fails on any drift between this manifest and the shipped runtime.
6. **Document** the change in `CHANGELOG.md` under `[Unreleased]`.

> [!NOTE]
> Knowledge documents are **drafts from sources** until reviewed by a Peruvian accounting/tax professional. Say so explicitly in the document (`Status: draft from sources — pending domain review`); do not present unreviewed knowledge as normative.

---

## Development Setup

### Prerequisites

- **Git 2.38+**
- A GitHub account with access to [arkelythex/drenyra-skills](https://github.com/arkelythex/drenyra-skills)
- **Bun** (only to run the conformance gate from a `drenyra-ai` checkout; this repo has no runtime)

### Clone

```bash
git clone https://github.com/arkelythex/drenyra-skills.git
cd drenyra-skills
```

### Run the conformance gate

The conformance gate lives in `drenyra-ai` — this repo is content-only. Clone `drenyra-ai` **as a sibling** so the default sibling layout resolves, then run:

```bash
# sibling layout: ../drenyra-ai and ../drenyra-skills
cd drenyra-ai
bun run skills:conformance
```

To point at this checkout explicitly:

```bash
bun run skills:conformance -- --manifest /path/to/drenyra-skills/skills/registry.json
```

Exit `0` means no drift between the authoring manifest and the shipped runtime (`BASE_PE_SKILLS`); exit `1` means drift. CI runs the same gate (`skills-conformance` job) and fails the build on any drift.

---

## Validation

Before opening a PR, run and report:

| Check | Command | Failure means |
| --- | --- | --- |
| Manifest schema | `npx ajv-cli validate -s skills/registry.schema.json -d skills/registry.json` (or any draft-07 validator) | The registry entry violates the manifest contract |
| Conformance | `bun run skills:conformance` (in a `drenyra-ai` checkout, sibling or `--manifest`) | The six conformance fields drift from the runtime copy |
| Source citations | Manual review | A normative claim without a real source — rejected |

Knowledge that changes fiscal behavior should also be reviewed by a domain professional (Peruvian accounting/tax) before it is treated as normative; unreviewed documents stay explicitly marked as drafts.

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

Commit messages **must** match this pattern:

```text
^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([a-z0-9\._-]+\))?!?: .+
```

### Format

```text
<type>(<optional-scope>)!: <description>

[optional body]

[optional footer]
```

### Allowed Types

| Type | Purpose |
| --- | --- |
| `feat` | New skill or registry capability |
| `fix` | Correction of a rule, source, or registry entry |
| `docs` | Documentation only |
| `refactor` | Structure change (no behavior change) |
| `chore` | Maintenance, tooling |
| `style` | Formatting (no logic change) |
| `test` | Adding or updating validation |
| `ci` | CI configuration |

### Examples

```text
feat(skills): add pe.detraction-check skill and registry entry
fix(pe): correct IGV base rule citation in pe.igv-validate
docs: update intended-usage
chore: refresh registry.schema.json description
```

### Breaking Changes

A normative change that alters a skill's rules, sources, or `maxAutonomy` is a **version bump**, not a "breaking" commit in the semantic-release sense — but it must be visible: bump the skill version in the document **and** in `registry.json` in the same commit, and note it in the CHANGELOG.

**Never** add `Co-Authored-By`, `Reviewed-by`, or "Generated with" AI markers to commits or PR bodies.

---

## Branch Naming

Branch names **must** match this pattern:

```text
^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$
```

**Rules:**

- All lowercase
- Use hyphens, dots, or underscores as separators (no spaces, no uppercase)
- Keep the description short and descriptive

**Examples:** `feat/pe-detraction-check`, `fix/igv-base-citation`, `docs/intended-usage`.

For medium/large changes, prefer an **isolated worktree** over a long-lived branch:

```bash
git worktree add ../drenyra-skills-wt -b feat/pe-detraction-check
```

---

## Pull Request Rules

### PR Size Budget

Keep PRs at or below **400 changed lines** (`additions + deletions`). This is a deliberate cognitive-load limit: a PR should be reviewable in roughly **60 minutes**. Knowledge review requires attention; an oversized diff hides the risk.

If your change cannot fit that budget, split it into **chained or stacked PRs** so each review remains focused.

### Work-Unit Commits

Structure commits by deliverable unit, not by file type. A good commit includes the skill, its registry entry, and its docs in one change — one skill per logical unit.

### Before Opening a PR

- [ ] There is a linked issue (`Closes #<N>`) approved with `status:approved`
- [ ] The PR is at or below 400 changed lines, or the chained-PR note was followed
- [ ] Commits follow Conventional Commits format, no AI attribution
- [ ] The skill follows `skills/_template/skill.template.md`
- [ ] Every normative rule cites its source; no invented content
- [ ] `skills/registry.json` satisfies `skills/registry.schema.json`
- [ ] `bun run skills:conformance` passes (no drift with the `drenyra-ai` runtime copy)
- [ ] Version bumps are consistent between the document and `registry.json`
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] Docs updated in this same PR (docs-as-code)
- [ ] I understand and take responsibility for the complete submission, and have disclosed any material AI assistance in the PR

### PR Title

Use the same Conventional Commits format as commit messages:

```text
feat(skills): add pe.detraction-check skill and registry entry
fix(pe): correct IGV base rule citation in pe.igv-validate
docs: update contributing guide
```

### Linking Your Issue

In the PR body, include one of:

```text
Closes #42
Fixes #42
Resolves #42
```

---

## Code of Conduct

Be respectful. We are building a fiscal system together.

- Critique content, not people
- Be constructive in reviews
- Welcome newcomers

This project follows the Contributor Covenant code of conduct. Violations may result in removal from the project.

---

## Questions?

- Open a **discussion** for questions and ideas — not issues.
- Report a vulnerability via **Private Vulnerability Reporting**. Never open a public issue for security defects.
- Understand the intended usage and frontier → [Intended Usage](docs/intended-usage.md)
- Navigate the repository → [Codebase Guide](docs/CODEBASE-GUIDE.md)
- Understand the ecosystem position → [Architecture](docs/architecture.md)
