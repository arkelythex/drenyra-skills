---
id: pe.legacy-ingest
version: 1.0.0
jurisdiction: PE
maxAutonomy: R0
normativeSources:
  - PCGE — Plan Contable General Empresarial (R. CNC 002-2019-EF/30)
  - R.S. 234-2006/SUNAT — Formatos de Libros y Registros Vinculados a Asuntos Tributarios
inputs: [source-format, raw-payload, scope]
outputs: [normalized-journal-entries, parsing-diagnostics]
---

<!-- Drafted 2026-08-27. Knowledge document for normalizing legacy accounting reports
     (PDF, XLSX, DBF dumps from CONCAR, SISCONT, StarSoft) into canonical Drenyra journal entries.
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Normalizes raw accounting reports and export files from legacy systems (such as CONCAR,
SISCONT, and StarSoft) into canonical Drenyra journal entries with double-entry balance
validation and PCGE 2019 chart of accounts compliance. This enables frictionless data
migration and legacy report ingestion into the immutable ledger.

## Rules

1. **Source format integrity.** The parser must validate the structure of the input format
   against known legacy layouts (`concar_pdf_balance`, `siscont_xlsx_vouchers`,
   `starsoft_dbf_dump`). Any unreadable or malformed chunk must be captured as a diagnostic
   rather than silently ignored.
   `R.S. 234-2006/SUNAT — Formatos de Libros y Registros Vinculados a Asuntos Tributarios`

2. **PCGE 2019 chart normalization.** Account codes extracted from legacy dumps must be mapped
   to the official PCGE 2019 catalog. Legacy accounts with outdated subdivisions must map to
   their corresponding active subcuentas/divisionarias.
   `PCGE — Plan Contable General Empresarial (R. CNC 002-2019-EF/30)`

3. **Double-entry balance identity.** Every normalized journal entry must satisfy the
   fundamental accounting identity: `sum(debitCents) === sum(creditCents)`. Entries with an
   imbalance are flagged as errors and must not be accepted into the immutable ledger.
   `PCGE — Marco Conceptual y Principio de Partida Doble`

4. **Integer cents discipline.** All currency values parsed from legacy strings and floats
   must be converted immediately to integer cents (BigInt), eliminating floating-point
   imprecision. Direction is captured in `side` (`debit` / `credit`), never in the sign of an amount.

5. **Fail-closed parsing diagnostics.** Any line or record that cannot be parsed unambiguously
   must produce a structured diagnostic entry containing line number, raw string, and error code.
   The ingest pipeline fails closed on unresolved critical parsing errors.

## Operational steps

1. Ingest `source-format` and decode `raw-payload` for the given RUC and period `scope`.
2. Execute layout-specific extraction to extract transaction dates, voucher numbers, glosas,
   account codes, document references, and monetary amounts.
3. Convert all monetary amounts to BigInt integer cents and normalize account codes to PCGE 2019.
4. Verify the double-entry balance identity (`debits === credits`) for each extracted journal entry.
5. Emit `normalized-journal-entries` candidates alongside `parsing-diagnostics` for review.

## References

- PCGE — Plan Contable General Empresarial (Resolución CNC N° 002-2019-EF/30).
- R.S. 234-2006/SUNAT — Formatos de Libros y Registros Vinculados a Asuntos Tributarios.
- Related skills: `pe.cierre-resultados`, `pe.conciliacion-bancaria`.
- Status: draft from sources — pending domain review by a Peruvian accounting professional.
