---
id: pe.sire-adversarial
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - SUNAT SIRE — R.S. 112-2021/SUNAT y R.S. 040-2022/SUNAT
  - TUO IGV — D.S. 055-99-EF, Arts. 18 y 19
inputs: [sire-proposal, ledger, period]
outputs: [discrepancies, proposed-actions, adversarial-payload]
---

<!-- Drafted 2026-08-27. Knowledge document for proactive adversarial reconciliation
     against SUNAT SIRE proposals before monthly closing.
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Executes an adversarial reconciliation between SUNAT's SIRE proposal (Registro de Compras
Electrónico - RCE and Registro de Ventas e Ingresos Electrónico - RVIE) and the company's internal
immutable ledger prior to period closing. Detects discrepancies, omitted documents, invalid supplier
statuses, and amount differences, and compiles structured replacement or complement payloads
ready for candidate submission to SUNAT.

## Rules

1. **Pre-closing adversarial inspection.** The proposal issued by SUNAT must never be accepted
   passively without cross-verification against the internal ledger. Differences must be resolved
   prior to monthly tax filing to prevent fiscal credit forfeiture or tax audits.
   `R.S. 112-2021/SUNAT y modificatorias (Reglamento SIRE)`

2. **Fiscal credit validity (IGV Arts. 18-19).** Invoices present in the SIRE proposal from
   suppliers whose RUC status is "No Habido" or "Baja de Oficio" at the date of issuance cannot
   be admitted for fiscal credit. The skill flags these documents for exclusion.
   `TUO IGV — D.S. 055-99-EF, Arts. 18-19`

3. **Discrepancy classification.** Differences between internal ledger entries and SIRE proposal
   records must be classified into exact categories:
   - `OMITTED_IN_SUNAT`: Invoice recorded in internal ledger but missing in SUNAT proposal.
   - `OMITTED_IN_LEDGER`: Invoice in SUNAT proposal not recorded in internal ledger.
   - `AMOUNT_MISMATCH`: Difference in taxable base, IGV, or total amount.
   - `RUC_INVALID`: Supplier non-compliance status.
   `R.S. 112-2021/SUNAT — Anexos Técnicos de Estructuras SIRE`

4. **Action payload generation.** For each identified discrepancy pattern, the skill produces
   the corresponding action payload:
   - `REPLACE_PROPOSAL`: Full proposal replacement archive (.zip containing pipe-delimited .txt).
   - `COMPLEMENT_PROPOSAL`: Complementary records file (.txt) for omitted valid purchases.
   - `EXCLUDE_DOCUMENT`: Exclusion list for non-deductible or invalid documents.
   `R.S. 112-2021/SUNAT — Procedimiento de Reemplazo y Complementación`

5. **BigInt precision for fiscal credit reconciliation.** All tax bases, IGV amounts, non-taxable
   concepts, and other tributes are compared at integer cent (BigInt) precision.

## Operational steps

1. Ingest `sire-proposal` (official SUNAT proposal data) and `ledger` records for the `period`.
2. Match documents using compound key: `(tipoCP, serie, numero, rucEmisor)`.
3. Compare taxable bases, IGV, ICBPER, and other charges at integer cent resolution.
4. Classify identified discrepancies by error type and risk severity.
5. Generate `proposed-actions` and construct the official SIRE pipe-delimited text/zip `adversarial-payload` candidate.

## References

- Resolución de Superintendencia N° 112-2021/SUNAT — Dictan disposiciones para el llevado del Registro de Ventas e Ingresos y de Compras a través del SIRE.
- Resolución de Superintendencia N° 040-2022/SUNAT — Modificaciones al Sistema Integrado de Registros Electrónicos.
- TUO de la Ley del IGV — D.S. 055-99-EF (Requisitos sustanciales y formales del crédito fiscal).
- Related skills: `pe.igv-validate`, `pe.sire-compare`, `pe.sire-filing`.
- Status: draft from sources — pending domain review by a Peruvian tax professional.
