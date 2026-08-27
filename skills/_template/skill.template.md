---
id: skill-template
version: 0.0.0
domain: <domain>
jurisdiction: <jurisdiction>
title: <Title — imperative, e.g. "Apply IGV to services invoices">
scope: <RUC/company/period where fiscal context applies — mandatory>
tags: [<tax>, <operational>, <close>]
# Optional. If present, `from` is required; `until` is an ISO date or null.
effective:
  from: <YYYY-MM-DD>
  until: <YYYY-MM-DD | null>
# Optional. Copy this shape to the registry entry and keep `output` equal to an
# exact item in that entry's `outputs` array. Omit groups with no cited mapping.
outputMappings:
  pcge:
    - output: <declared-output>
      accountCode: <cited-PCGE-account-code>
      sourceCitation:
        title: <source-title-and-version>
        locator: <account-table-or-section>
        uri: <optional-authoritative-URI>
  xbrl:
    - output: <declared-output>
      taxonomy: <cited-taxonomy-and-version>
      concept: <cited-concept-name>
      sourceCitation:
        title: <source-title-and-version>
        locator: <taxonomy-element-or-section>
        uri: <optional-authoritative-URI>
sources:
  - <norm/reference, e.g. SUNAT norm, internal runbook>
---

<!-- One skill = one versioned knowledge document. Content is data, not code:
     no imports, no logic — rules, references, and operational steps that the
     drenyra-ai runtime validates and agents consume. Never fabricate fiscal
     rules: every normative claim and mapping must cite a source.

     Both `effective` and `outputMappings` are optional. `effective` describes
     this skill version's validity, not a law's validity. PCGE and XBRL mappings
     are independent interoperability declarations: XBRL is not a SUNAT or legal
     requirement, and no PCGE-to-XBRL equivalence is automatic. Do not add dates,
     accounts, taxonomies, or concepts without source evidence. -->

## Purpose

What this skill lets an agent do correctly, and why.

## Rules

- Rule 1 — normative statement, with source.
- Rule 2 — edge cases and exceptions.

## Operational steps

1. Step — deterministic, verifiable order.
2. Step — each step must be reviewable as a candidate (see drenyra-ai contracts).

## References

- Source documents (norm, runbook, internal policy).
- Related skills.
