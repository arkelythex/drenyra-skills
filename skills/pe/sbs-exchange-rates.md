---
id: pe.sbs-exchange-rates
version: 1.0.0
jurisdiction: PE
maxAutonomy: R0
normativeSources:
  - SBS — Tipos de Cambio Oficiales (Superintendencia de Banca, Seguros y AFP)
  - TUO LIR — D.S. 179-2004-EF, Art. 61 (Tratamiento de Diferencia de Cambio)
  - PCGE — Cuentas 676 y 776 (Diferencia de Cambio)
  - NIC 21 — Efectos de las Variaciones en las Tasas de Cambio de la Moneda Extranjera
inputs: [daily-sbs-rates, foreign-currency-ledger, scope]
outputs: [revalued-ledger-entries, exchange-difference-drafts]
---

<!-- Drafted 2026-08-27. Knowledge document for revaluing foreign currency balances
     and computing exchange rate differences under Peruvian accounting and tax rules.
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Automates the retrieval and application of official exchange rates published by the Superintendencia
de Banca, Seguros y AFP (SBS), performing daily or period-end revaluation of foreign currency
monetary assets and liabilities. Generates candidate exchange difference journal entries (PCGE
Cuenta 676 Pérdida por diferencia de cambio / Cuenta 776 Ganancia por diferencia de cambio)
in compliance with LIR Art. 61 and NIC 21.

## Rules

1. **Official SBS exchange rate convention.** For accounting and tax valuation in Peru, the
   official exchange rate published by the SBS must be applied:
   - **Assets (Activos / Cuentas por cobrar / Bancos en ME):** Revalued at **Tipo de Cambio Compra**.
   - **Liabilities (Pasivos / Cuentas por pagar en ME):** Revalued at **Tipo de Cambio Venta**.
   `TUO LIR — D.S. 179-2004-EF, Art. 61 inc. a y b; Resolución SBS N° 11395-2009`

2. **Period-end revaluation mandatory rule (LIR Art. 61).** Foreign currency monetary balances
   existing at the end of each fiscal month and year must be adjusted to the closing exchange rate.
   The resulting difference constitutes taxable income (ganancia gravable) or deductible expense
   (pérdida computable) for corporate income tax purposes.
   `TUO LIR — D.S. 179-2004-EF, Art. 61`

3. **PCGE account mapping.**
   - Net exchange loss is recognized in subcuenta **676** (*Diferencia de cambio*).
   - Net exchange gain is recognized in subcuenta **776** (*Diferencia de cambio*).
   `PCGE — Plan Contable General Empresarial (Cuentas 67 y 77)`

4. **Integer math precision for foreign currency conversions.** Exchange rates are represented
   as scaled integers (e.g. 1 USD = 3.7540 PEN represented as `37540` with scale 4) and balances
   are stored in integer cents (BigInt). Rounding is executed under Peruvian standard half-up
   rules at the final cent conversion.

## Operational steps

1. Fetch official `daily-sbs-rates` for the closing date of the specified `scope`.
2. Extract all open monetary asset and liability balances in foreign currency from `foreign-currency-ledger`.
3. Compute the revalued balance in PEN integer cents using SBS Compra for assets and SBS Venta for liabilities.
4. Calculate net difference: `differenceCents = revaluedCents - bookBalanceCents`.
5. Generate candidate `exchange-difference-drafts` balancing the asset/liability adjustment
   against PCGE 676 (if negative difference / loss) or PCGE 776 (if positive difference / gain).

## References

- Superintendencia de Banca, Seguros y Administradoras Privadas de Fondos de Pensiones (SBS) — Portal de Tipos de Cambio Oficiales.
- TUO de la Ley del Impuesto a la Renta — D.S. 179-2004-EF (Art. 61).
- Norma Internacional de Contabilidad 21 (NIC 21) — Efectos de las Variaciones en las Tasas de Cambio de la Moneda Extranjera.
- Plan Contable General Empresarial (PCGE 2019) — Cuentas 676 y 776.
- Related skills: `pe.cierre-resultados`, `pe.conciliacion-bancaria`.
- Status: draft from sources — pending domain review by a Peruvian accounting professional.
