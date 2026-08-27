---
id: pe.tax-shield
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - TUO LIR — D.S. 179-2004-EF, Art. 37 (Principio de Causalidad)
  - TUO LIR — D.S. 179-2004-EF, Art. 44 (Gastos No Deducibles)
inputs: [journal-entry, industry-context, scope]
outputs: [causality-disposition, reparo-tax-target, normative-justification]
---

<!-- Drafted 2026-08-27. Knowledge document for evaluating expense causality and
     identifying non-deductible expenses under Peruvian Income Tax law.
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Evaluates candidate purchase and expense journal entries against the Principle of Causality
(Principio de Causalidad, Art. 37) and non-deductible prohibitions (Art. 44) under the Peruvian
Income Tax Law (TUO LIR). Identifies expenses lacking business justification or personal
expenses of partners/executives, and prepares candidate reclassifications to tax addition
accounts (reparos tributarios / PCGE 659) to safeguard the annual income tax return (DJ Anual).

## Rules

1. **Principio de Causalidad general (LIR Art. 37).** An expense is deductible only when it is
   necessary to generate or maintain the taxable income source. The evaluation requires
   verifying reasonableness, proportionality, and general nature (for employee benefits).
   `TUO LIR — D.S. 179-2004-EF, Art. 37`

2. **Prohibition of personal expenses (LIR Art. 44 inc. a).** Personal and living expenses of
   the taxpayer, partners, shareholders, or directors are non-deductible. If the glosa or
   supplier activity denotes personal leisure, luxury, or non-business consumption, a tax
   reparo must be proposed.
   `TUO LIR — D.S. 179-2004-EF, Art. 44, inc. a`

3. **Fehaciencia and documentary verification (LIR Art. 37 & RTF Jurisprudence).** A deduction
   requires verified economic reality (fehaciencia). Invoices from high-risk or irregular
   suppliers lacking delivery notes (guías de remisión), contracts, or operational evidence
   cannot be admitted as fully deductible without additional documentary proof.
   `Tribunal Fiscal — Criterios de Fehaciencia del Gasto`

4. **Tax addition account routing (reparos tributarios).** Non-deductible expenses identified
   under Art. 44 must be routed to account `659` (Otros gastos de gestión / Gastos no deducibles)
   or flagged for addition in the Annual Income Tax Return calculation worksheet.
   `PCGE — Subcuenta 659 (Otros gastos de gestión)`

5. **BigInt precision for tax additions.** All evaluated amounts, partial additions, and
   deductible limits are computed in integer cents (BigInt), avoiding rounding drift.

## Operational steps

1. Intercept candidate journal entries for purchases and expenses for the specified RUC `scope`.
2. Analyze the invoice description (`glosa`), supplier CIIU, and operation reference against
   the company's active `industry-context` and corporate purpose.
3. Apply the criteria of necessity, proportionality, and explicit prohibitions of Art. 44.
4. Classify disposition into `ACCEPTED`, `REPARED_TOTAL`, or `REPARED_PARTIAL`.
5. For non-deductible portions, emit `reparo-tax-target` (PCGE 659 / Adición Tributaria)
   and format `normative-justification` citing the exact article and inciso.

## References

- TUO de la Ley del Impuesto a la Renta — Decreto Supremo N° 179-2004-EF (Arts. 37 y 44).
- Plan Contable General Empresarial (PCGE 2019) — Dinámica de la Cuenta 659.
- Jurisprudencia de Observancia Obligatoria del Tribunal Fiscal sobre Causalidad y Fehaciencia.
- Related skills: `pe.igv-validate`, `pe.bancarizacion-gate`, `pe.cierre-resultados`.
- Status: draft from sources — pending domain review by a Peruvian tax professional.
