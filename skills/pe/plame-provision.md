---
id: pe.plame-provision
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - D.S. 001-97-TR — TUO de la Ley de Compensación por Tiempo de Servicios (CTS)
  - Ley 27735 y D.S. 005-2002-TR — Ley y Reglamento de Gratificaciones Legales
  - D.L. 713 y D.S. 012-92-TR — Descansos Remunerados y Vacaciones
  - Ley 26790 — Ley de Modernización de la Seguridad Social en Salud (EsSalud 9%)
  - PCGE — Plan Contable General Empresarial (Cuentas 62 y 41)
inputs: [payroll-contracts, worked-period, attendance-records, scope]
outputs: [social-benefit-provisions, pcge-payroll-entries, plame-import-draft]
---

<!-- Drafted 2026-08-27. Knowledge document for calculating monthly labor provisions
     (CTS, Gratificaciones, Vacaciones, EsSalud) and generating PCGE Element 6/41 entries
     and PDT PLAME import structures under Peruvian labor legislation.
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Calculates monthly social benefit provisions (Compensación por Tiempo de Servicios - CTS,
Gratificaciones legales, Vacaciones truncas/devengadas, and EsSalud 9% employer contribution)
for employees under the Peruvian general labor regime (D.L. 728 / D.L. 713). Generates balanced
PCGE Element 6 (Gastos de personal) and Element 40/41 (Pasivos laborales) candidate journal entries
and prepares structured import files for SUNAT PDT PLAME (Planilla Mensual de Pagos).

## Rules

1. **Monthly CTS provision (D.S. 001-97-TR).** The monthly CTS accrual is calculated as
   `1/12` of the computable compensation (Basic Salary + Family Allowance / Asignación Familiar +
   `1/6` of the projected Gratificación).
   `D.S. 001-97-TR — Arts. 9 y 10 (Remuneración computable para la CTS)`

2. **Monthly Gratificaciones provision (Ley 27735 & Ley 30334).** The monthly accrual is
   `1/6` of the computable salary for each six-month period (January-June for Fiestas Patrias;
   July-December for Navidad), plus the 9% Extraordinary Bonus (Bonificación Extraordinaria
   under Ley 29351/30334, or 6.75% if EPS enrolled).
   `Ley 27735 — Art. 2 y 3; Ley 30334 — Desgravación de gratificaciones`

3. **Monthly Vacaciones provision (D.L. 713).** The monthly vacation accrual is `1/12` of the
   basic monthly remuneration plus the corresponding 9% EsSalud contribution on the vacation base.
   `Decreto Legislativo N° 713 — Arts. 10 y 15`

4. **EsSalud employer contribution (Ley 26790).** The monthly healthcare contribution is 9%
   of computable earnings. The monthly base cannot be lower than the official Remuneración Mínima
   Vital (RMV).
   `Ley N° 26790 — Art. 6`

5. **PCGE double-entry mapping.** All provisions must balance exactly:
   - **Debits (Gastos):** 6211 (Sueldos), 6214 (Gratificaciones), 6215 (Vacaciones),
     6271 (EsSalud), 6291 (CTS).
   - **Credits (Pasivos):** 4031 (EsSalud por pagar), 4111 (Sueldos por pagar),
     4114 (Gratificaciones por pagar), 4115 (Vacaciones por pagar), 4151 (CTS por pagar).
   `PCGE 2019 — Cuentas 62 y 41`

6. **Integer cents discipline.** Every benefit accrual, base prorating, and tax contribution
   must be computed in BigInt integer cents.

## Operational steps

1. Ingest `payroll-contracts`, `attendance-records`, and compensation structures for `worked-period`.
2. Compute computable bases per employee for CTS, Gratificaciones, Vacaciones, and EsSalud.
3. Calculate monthly fractions in integer cents and compile `social-benefit-provisions`.
4. Construct candidate `pcge-payroll-entries` balancing Element 6 expenses with Element 40/41 liabilities.
5. Generate `plame-import-draft` structures (.rem, .jor, .snl) for SUNAT PDT PLAME upload.

## References

- Decreto Supremo N° 001-97-TR — TUO de la Ley de Compensación por Tiempo de Servicios.
- Ley N° 27735 y D.S. N° 005-2002-TR — Ley que regula el otorgamiento de las Gratificaciones Legales.
- Ley N° 30334 — Ley que desgrava permanentemente las gratificaciones por Fiestas Patrias y Navidad.
- Decreto Legislativo N° 713 — Legislación sobre descansos remunerados de los trabajadores.
- Ley N° 26790 — Ley de Modernización de la Seguridad Social en Salud.
- Plan Contable General Empresarial (PCGE 2019) — Cuentas 62 y 41.
- Related skills: `pe.cierre-resultados`, `pe.conciliacion-bancaria`.
- Status: draft from sources — pending domain review by a Peruvian labor/tax professional.
