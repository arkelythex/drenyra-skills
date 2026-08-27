---
id: pe.itf-justification
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - Ley 28194 — Ley para la Lucha contra la Evasión y para la Formalización de la Economía (ITF)
  - TUO LIR — D.S. 179-2004-EF, Art. 52 (Incremento Patrimonial No Justificado)
  - Código Tributario — D.S. 133-2013-EF, Art. 62 (Facultad de Fiscalización)
inputs: [bank-statement, itf-movements, legal-contracts, scope]
outputs: [justification-file, unjustified-movements, defense-evidence]
---

<!-- Drafted 2026-08-27. Knowledge document for cross-referencing ITF bank transactions
     against corporate contracts and accounting vouchers to preempt SUNAT IPNJ audits.
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Monitors banking movements subject to the Financial Transactions Tax (Impuesto a las Transacciones
Financieras - ITF, 0.005%) and correlates every bank deposit or debit against legal and accounting
instruments (commercial invoices, loan agreements with date-certainty / contratos de mutuo con
fecha cierta, capital contribution deeds, and shareholder meeting minutes). Compiles a proactive
defense dossier to eliminate the risk of SUNAT Unjustified Equity Increase (Incremento Patrimonial
No Justificado - IPNJ) or presumed omitted sales assessments.

## Rules

1. **ITF cross-audit traceability.** Under Ley 28194, financial institutions report all transactions
   subject to ITF directly to SUNAT. Any bank credit without a corresponding electronic invoice,
   accounting revenue entry, or documented non-taxable origin constitutes an immediate tax audit trigger.
   `Ley 28194 — Art. 9 (Hecho imponible del ITF) y Art. 17 (Obligación de información)`

2. **Presumption of Unjustified Equity Increase (LIR Art. 52).** Inflows into company or personal
   bank accounts that lack reliable legal backing cannot be justified by mere testimony or
   unnotarized private documents. The law establishes a legal presumption of undeclared net income.
   `TUO LIR — D.S. 179-2004-EF, Art. 52`

3. **Date-certainty requirement for loan agreements (contratos de mutuo dinerario).** Monetary
   loans received by the company must be supported by contracts with date-certainty (fecha cierta
   via notary certification or public deed) and bank-traceable transfers prior to fund utilization.
   `TUO LIR — D.S. 179-2004-EF, Art. 52-A & Jurisprudencia del Tribunal Fiscal`

4. **BigInt precision for banking and ITF reconciliations.** Bank movement amounts, withholding
   rates (0.005%), and reconciled totals must be computed in integer cents (BigInt).

5. **Fail-closed risk classification.** Bank inflows lacking matched evidentiary support must
   be surfaced immediately in `unjustified-movements` to prompt documentation assembly prior
   to fiscal year closing.

## Operational steps

1. Ingest `bank-statement` movements and filter those bearing `itf-movements` deductions for the `scope`.
2. Match bank inflows and outflows against ledger journal entries and verified electronic invoices.
3. For non-trade bank inflows (loans, capital increases, partner transfers), cross-reference
   against digital copies of `legal-contracts` and notarized minutes.
4. Classify movements into `JUSTIFIED_TRADE`, `JUSTIFIED_FINANCIAL`, or `UNJUSTIFIED_RISK`.
5. Emit `justification-file` linking bank trace IDs to legal instruments and compile `defense-evidence`.

## References

- Ley N° 28194 — Ley para la Lucha contra la Evasión y para la Formalización de la Economía.
- TUO de la Ley del Impuesto a la Renta — D.S. 179-2004-EF (Art. 52, Incremento Patrimonial No Justificado).
- Código Tributario — D.S. 133-2013-EF (Art. 62, Fiscalización de flujos financieros).
- Related skills: `pe.conciliacion-bancaria`, `pe.bancarizacion-gate`, `pe.tax-shield`.
- Status: draft from sources — pending domain review by a Peruvian tax professional.
