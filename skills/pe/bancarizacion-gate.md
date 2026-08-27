---
id: pe.bancarizacion-gate
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - Ley 28194 — Ley de Bancarización y D.L. 1529 (Uso de Medios de Pago)
  - TUO LIR — D.S. 179-2004-EF, Art. 44 inc. j (Gastos sin medio de pago)
  - TUO IGV — D.S. 055-99-EF, Art. 19 (Pérdida de Crédito Fiscal)
inputs: [payment-entry, payment-method, amount, scope]
outputs: [bancarizacion-verdict, compliance-exception]
---

<!-- Drafted 2026-08-27. Knowledge document for intercepting and blocking cash settlements
     that exceed the statutory bancarization thresholds under Peruvian tax law.
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Acts as a pre-commitment compliance gate intercepting cash payment entries. Verifies compliance
with the Peruvian Bancarization Law (Ley 28194, modified by Decreto Legislativo N° 1529), which
mandates the use of authorized banking payment methods for obligations equal to or exceeding
S/ 2,000 or US$ 500. Prevents catastrophic tax contingencies: the 100% loss of income tax
deductibility and 100% forfeiture of the IGV fiscal credit.

## Rules

1. **Statutory bancarization thresholds (D.L. 1529).** Any payment for obligations equal to
   or greater than **S/ 2,000 (200,000 integer cents)** or **US$ 500 (50,000 integer cents)**
   must be executed strictly through authorized financial payment channels (wire transfer,
   cheque, credit/debit card, deposits in account).
   `Ley 28194 — Art. 3 y 4, modificado por Decreto Legislativo N° 1529 (vigente desde abril 2022)`

2. **Total disallowance of expense and tax credit (LIR Art. 44 inc. j & IGV Art. 19).**
   Obligations settled in cash that exceed the statutory threshold lose their right to be
   deducted as cost or expense for Income Tax purposes and lose the corresponding IGV fiscal credit,
   even when the underlying invoice is genuine and validly issued.
   `TUO LIR — D.S. 179-2004-EF, Art. 44 inc. j; TUO IGV — D.S. 055-99-EF, Art. 19`

3. **Fractionation prohibition (Indivisibilidad del pago).** Splitting a single invoice or
   obligation into multiple partial cash payments to circumvent the S/ 2,000 / $500 threshold
   is legally prohibited. The threshold applies to the total value of the obligation/invoice,
   not to each individual installment.
   `Ley 28194 — Art. 3, segundo párrafo`

4. **Third-party account restriction (D.L. 1529).** Payments made directly to bank accounts
   of third parties different from the supplier or creditor require a formal prior communication
   to SUNAT before payment execution; otherwise, the payment is deemed non-bancarized.
   `Decreto Legislativo N° 1529 — Art. 5-A`

5. **Fail-closed interceptor gate.** Any candidate payment entry specifying `EFECTIVO` (cash)
   where the total invoice obligation is `>= 200,000` PEN cents or `>= 50,000` USD cents
   must be blocked (`bancarizacion-verdict: REJECTED_NON_COMPLIANT`).

## Operational steps

1. Intercept `payment-entry` candidate and inspect the underlying invoice total `amount` in BigInt cents.
2. Evaluate `payment-method` against the statutory threshold:
   - If currency is PEN and amount >= 200,000 cents: require banking channel.
   - If currency is USD and amount >= 50,000 cents: require banking channel.
3. If payment method is cash (`EFECTIVO`) and threshold is reached, reject candidate and issue
   `compliance-exception` with the statutory reference.
4. If payment method is an authorized banking channel, verify bank movement trace reference.
5. Emit `bancarizacion-verdict` (`CONFORMANT` / `NON_COMPLIANT`).

## References

- Ley N° 28194 — Ley para la Lucha contra la Evasión y para la Formalización de la Economía.
- Decreto Legislativo N° 1529 — Modifica la Ley N° 28194 (reducción de montos para uso de medios de pago).
- TUO de la Ley del Impuesto a la Renta — D.S. 179-2004-EF (Art. 44 inc. j).
- TUO de la Ley del IGV — D.S. 055-99-EF (Art. 19).
- Related skills: `pe.conciliacion-bancaria`, `pe.itf-justification`, `pe.tax-shield`.
- Status: draft from sources — pending domain review by a Peruvian tax professional.
