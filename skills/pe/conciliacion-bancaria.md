---
id: pe.conciliacion-bancaria
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - PCGE — Plan Contable General Empresarial (R. SMV 043-2010-SMV/01)
  - NIC 1 — Presentación de Estados Financieros
  - Código Tributario — D.S. 133-2013-EF
inputs: [bank-statement, ledger, scope]
outputs: [differences, adjustments, reconciliation-report]
---

<!-- Drafted 2026-08-16. Knowledge document for the monthly bank reconciliation
     between the bank statement (estado de cuenta) and the ledger (libro mayor).
     Content is data, not code: rules and operational steps that the drenyra-ai
     runtime validates and agents consume. The deterministic engine lives in
     drenyra-ai (bank-reconciliation/); this document is the normative knowledge
     that engine and mission follow. Every rule cites its source; pending a
     domain review by a Peruvian accountant before normative use. -->

## Purpose

Lets an agent reconcile the bank account ("Bancos") for one RUC and one fiscal
period: normalize bank-statement rows and ledger movements into one canonical
shape, match them, classify differences, generate adjustment drafts, and emit an
executive report with a reconciliation identity check. The goal is a bank balance
and a ledger balance that agree, with every difference explained and every
adjustment justified and approved.

## Rules

1. **Cash accounts are reconciled, never assumed.** The bank balance presented
   in financial statements must agree with the bank's statement; unreconciled
   differences are a risk of misstatement.
   `PCGE — Plan Contable General Empresarial (R. SMV 043-2010-SMV/01)`
   (cash is subject to the same completeness and valuation discipline as any
   asset line).

2. **Financial statement structure.** Cash appears within current assets and its
   ending balance must be supportable by the underlying bank account detail.
   `NIC 1 — Presentación de Estados Financieros`

3. **Registration duty.** Operations must be recorded in the accounting books
   and supported by documentation; a movement in the bank statement that has no
   ledger record is an omission to investigate, not to ignore.
   `Código Tributario — D.S. 133-2013-EF` (obligación de registro).

4. **Canonical side mapping.** For the asset account "Bancos", a ledger debit
   increases the balance and a credit decreases it; a bank deposit increases and
   a withdrawal decreases. Normalization maps both to one canonical frame:
   bank deposit → `inflow`; bank withdrawal → `outflow`; ledger debit →
   `inflow`; ledger credit → `outflow`. Amounts are integer cents (BigInt),
   never floats; direction lives in `side`, never in the sign of an amount.

5. **Matching discipline.** Movements match by normalized reference first; the
   fallback is an EXACT amount AND same-day date with equal canonical side.
   Amount alone or date alone never matches. An ambiguous reference (more than
   one counterpart) is surfaced as a conflict and never guessed.

6. **Fail-closed adjustments.** Adjustment drafts are produced only for
   classified differences (bank-only or ledger-only movements). Matched and
   conflict movements never produce drafts. A difference that cannot be
   classified blocks the operation — the ledger is never asked to correct an
   invented entry.

7. **Reconciliation identity.** The report is reconciled only when every
   movement is matched AND `ledgerFinal + netAdjustmentCents === bankFinal`.
   Any unmatched difference forces `reconciled = false` even if the arithmetic
   identity would hold.

## Operational steps

1. Obtain the bank statement for the period (initial/final balances and rows).
2. Obtain the ledger balance of the Bancos account at period end.
3. Normalize both sources to canonical movements; reject unparseable rows
   fail-closed with typed reasons.
4. Match movements (reference-first, amount+same-day fallback) and classify
   matched / bank-only / ledger-only / conflict.
5. Generate adjustment drafts for classified differences, each with a
   justification referencing the originating movement and an approval
   requirement.
6. Validate documentary support for each draft (factura, comprobante) —
   gate: a draft without support cannot be registered.
7. Register approved adjustments and emit the executive report with the
   reconciliation identity; store the report and issue a reconciliation receipt.

## References

- PCGE — Plan Contable General Empresarial (R. SMV 043-2010-SMV/01)
  family; PE practice reference for cash).
- NIC 1 — Presentación de Estados Financieros.
- Código Tributario — D.S. 133-2013-EF: obligación de registro y contabilidad.
- Related skills: `pe.igv-validate`, `pe.sire-compare`.
- Status: draft from sources — pending a domain review by a Peruvian accounting
  professional before normative use.
