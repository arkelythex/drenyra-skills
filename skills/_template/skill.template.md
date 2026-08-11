---
id: skill-template
version: 0.0.0
domain: <domain>
jurisdiction: <jurisdiction>
title: <Title — imperative, e.g. "Apply IGV to services invoices">
scope: <RUC/company/period where fiscal context applies — mandatory>
tags: [<tax>, <operational>, <close>]
effective:
  from: <YYYY-MM-DD>
  until: <YYYY-MM-DD | null>
sources:
  - <norm/reference, e.g. SUNAT norm, internal runbook>
---

<!-- One skill = one versioned knowledge document. Content is data, not code:
     no imports, no logic — rules, references, and operational steps that the
     drenyra-ai runtime validates and agents consume. Never fabricate fiscal
     rules: every normative claim must cite a source. -->

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
