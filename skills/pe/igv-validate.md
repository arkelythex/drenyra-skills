---
id: pe.igv-validate
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - TUO IGV — D.S. 055-99-EF
inputs: [invoice, tax-period]
outputs: [igv-validation]
---

<!-- Seed knowledge doc: mirrors the registry manifest entry (drenyra-ai ships
     BASE_PE_SKILLS bound to this id/version; skills-conformance.mjs fails on
     drift). The normative RULES below are extracted from the cited source and
     must be authored against it — never invented. Every normative claim cites
     its source. -->

## Purpose

Validates IGV treatment on an invoice for a tax period: rate application,
exemptions, and base adjustments per the IGV TUO.

## Rules

> **Authoring note (seed):** rule extraction from `TUO IGV — D.S. 055-99-EF`
> is pending. Do NOT add rules from memory — extract them from the cited norm
> and cite the article (e.g. `D.S. 055-99-EF art. 3`). This doc stays a
> metadata shell until the sourced rules land.

- (pending) rate application rule — cite article
- (pending) exemption rule — cite article
- (pending) base adjustment rule — cite article

## Operational steps

1. Validate invoice shape and tax period (inputs).
2. Apply the sourced IGV rules (above).
3. Emit `igv-validation` with evidence references.

## References

- TUO IGV — D.S. 055-99-EF (normative source; rules extracted from here).
- drenyra-ai `candidates/ruc.ts` — RUC Módulo 11 checksum (fiscal scope
  integrity) referenced by scope-gated skills.
