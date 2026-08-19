# Changelog

All notable changes to Drenyra Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). The repository has **no released versions yet** — all history below is pre-release development. Content is versioned per skill through `skills/registry.json`; a normative change bumps the skill version and is noted here.

## [Unreleased]

### Added

- **Skill registry manifest + first knowledge document** — `skills/registry.json` as the authoring source of truth for skill definitions and `skills/pe/igv-validate.md` as the first knowledge doc (slice 3 of the ecosystem cleanup). `2026-08-11`
- **IGV validation knowledge** — `pe.igv-validate` rules drafted from cited official sources (TUO IGV — D.S. 055-99-EF), pending domain review. `2026-08-11`
- **11 PE skill definitions synced with the `drenyra-ai` runtime** — registry grows to 11 skills (IGV, SIRE, detracciones, retenciones, percepciones, bank reconciliation, fixed-asset depreciation, portfolio provisions, monthly ISR, closing entries), plus the `pe.conciliacion-bancaria` knowledge document; `skills:conformance` PASS. `2026-08-16`

### Changed

- **Ecosystem table points at Drenyra Command Center** — repository scaffold with the ecosystem table and direction rule (content vs. runtime). `2026-08-10`

### Fixed

- **README ecosystem facts corrected** — repository visibility and statuses aligned with the ecosystem reality (public repos; this repo **In development**). `2026-08-19`
- **Branding guide paths** — sibling-relative `brand-conformance` path and Shared-DNA art-direction pointer per the brand-system contract (v0.2). `2026-08-11`

### Docs

- **Drenyra Dominion Program reference** — points to SDD-070 (Skills and Policy Supply Chain) and SDD-050 (Peruvian Monthly Close). `2026-08-11`
- **Skills banner guide** — `assets/branding/BRAND.md` per brand-system v0.2. `2026-08-11`
