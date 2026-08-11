---
id: pe.igv-validate
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - TUO IGV — D.S. 055-99-EF
inputs: [invoice, tax-period]
outputs: [igv-validation]
---

<!-- Drafted 2026-08-11 from the cited official sources (SUNAT). Every rule
     cites its article; the detailed extraction is pending a domain review by a
     Peruvian tax professional before this doc becomes normative. -->

## Purpose

Validates IGV treatment on an invoice for a tax period: whether the operation
is within the IGV scope (gravada), exonerada, or inafecta, and whether the
rate/base applied on the invoice are correct.

## Rules

1. **Hecho imponible (operaciones gravadas).** The operation is within IGV
   scope when it is one of the art. 1 cases: sale of movable goods in the
   country, provision or use of services in the country, construction
   contracts, first sale of real estate by the builder, or import of goods.
   `TUO IGV — D.S. 055-99-EF, art. 1`
   (source: sunat.gob.pe/legislacion/tributaria/igv/ley/capitul1.htm)

2. **Classification definitions.** Whether a transaction qualifies as
   "venta", "bienes muebles", "servicios" or "construcción" is determined by
   the art. 3 definitions (e.g. "servicio" includes every paid provision that
   constitutes third-category income, including certain leases).
   `TUO IGV — D.S. 055-99-EF, art. 3`

3. **Tasa.** The rate applies over the taxable base: in 2026 the total is
   **18%** (15.5% IGV + 2.5% Impuesto de Promoción Municipal).
   `TUO IGV — D.S. 055-99-EF, art. 17`
   (source: orientacion.sunat.gob.pe/3053-concepto-tasa-y-operaciones-gravadas-igv-empresas)

4. **Base imponible.** The taxable base for services includes the full amount
   the user must pay (separate charges, complementary services, financing
   interest/expenses), excluding normal discounts shown on the document and
   later exchange-rate differences. Services base is regulated by arts. 13-14.
   `TUO IGV — D.S. 055-99-EF, arts. 13-14`
   (source: sunat.gob.pe/legislacion/igv/ley/capitul5.htm)

5. **Exoneraciones.** Operations exonerated from IGV are only those expressly
   listed in **Apéndices I (goods) and II (services)**; the operation must
   match the description, requirements and, when applicable, the tariff
   heading exactly. "Exonerada" (inside scope, temporarily relieved) must not
   be confused with "inafecta" (outside scope).
   `TUO IGV — D.S. 055-99-EF, Apéndices I-II`
   (source: sunat.gob.pe/legislacion/igv/ley/capitul2.htm)

6. **Exportación de servicios (inafecta).** An export of services that meets
   the legal requirements is IGV-inafecta: invoiced without IGV. Requirements
   include an onerous service rendered by a domiciled provider to a
   non-domiciled beneficiary whose use/exploitation occurs abroad (per the
   relevant Apéndice V case). IGV paid on export-linked acquisitions may
   generate exporter credit (art. 34).
   `TUO IGV — D.S. 055-99-EF, Apéndice V; art. 34`
   (source: sunat.gob.pe/legislacion/tributaria/igv/ley/capitul9.htm)

## Operational steps

1. Validate invoice shape + tax period (inputs; RUC scope integrity via
   `candidates/ruc.ts` Módulo 11 checksum).
2. Classify the operation: art. 1 scope → art. 3 definitions.
3. Determine gravada / exonerada (Apéndices I-II) / inafecta (e.g. exports,
   Apéndice V).
4. If gravada: verify the applied rate (18% = 15.5% + 2.5% IPM, art. 17) and
   base (arts. 13-14) match the invoice.
5. Emit `igv-validation` with the classification and per-rule evidence
   references; surface exceptions as candidates.

## References

- TUO IGV — D.S. 055-99-EF: sunat.gob.pe/legislacion/igv/ley/tuo.html
- SUNAT orientation — concepto, tasa y operaciones gravadas:
  orientacion.sunat.gob.pe/3053-concepto-tasa-y-operaciones-gravadas-igv-empresas
- **Status: draft from sources — pending domain review by a Peruvian tax
  professional before normative use.**
