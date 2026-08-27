---
id: pe.ple-export
version: 1.0.0
jurisdiction: PE
maxAutonomy: R1
normativeSources:
  - R.S. 286-2009/SUNAT — Sistema de Libros Electrónicos (PLE)
  - R.S. 234-2006/SUNAT — Formatos de Libros y Registros Vinculados a Asuntos Tributarios
  - R.S. 379-2013/SUNAT — Sujetos Obligados a Llevar Libros de Manera Electrónica
inputs: [ledger, book-type, period, scope]
outputs: [ple-txt-payload, hash-validation-record, export-diagnostics]
---

<!-- Drafted 2026-08-27. Knowledge document for formatting and exporting immutable ledger
     records into official SUNAT PLE pipe-delimited text structures (.txt).
     Content is data, not code: rules and operational steps that the drenyra-ai runtime
     validates and agents consume. Every rule cites its normative source. -->

## Purpose

Compiles accounting records from Drenyra's immutable ledger into official SUNAT PLE (Programa
de Libros Electrónicos) pipe-delimited text files (.txt) with strict structural compliance,
rigorous column syntax, canonical naming conventions, and integrity hashes. Covers non-SIRE
electronic books, including Libro Diario (5.1/5.2), Libro Mayor (6.1), and Non-Current
Assets (7.1).

## Rules

1. **PLE canonical filename nomenclature.** File names must adhere strictly to the 33-character
   official SUNAT specification:
   `LE` + `[RUC (11 digits)]` + `[Periodo (YYYYMM00)]` + `[Código Libro (6 digits)]` +
   `[Código Oportunidad (2 digits)]` + `[Indicador Operaciones (1 digit)]` +
   `[Indicador Contenido (1 digit)]` + `[Indicador Moneda (1 digit)]` + `[Indicador Generador (1 digit)]` + `.txt`
   `R.S. 286-2009/SUNAT — Anexo 1 (Estructuras de los Nombres de Archivo)`

2. **Pipe-delimited column syntax.** Every field must be separated by the vertical pipe character
   `|`. Every line must start with the first field, contain the exact number of required columns
   for the specific book type, and terminate with a trailing `|` followed by standard CRLF line endings.
   Empty optional fields must be represented as consecutive pipes (`||`).
   `R.S. 286-2009/SUNAT — Anexo 2 (Estructura de la Información de los Libros)`

3. **Operation status indicators (Indicadores de Estado).** Every row must carry a valid state flag:
   - `1`: Operation recorded in the open reporting period.
   - `8`: Operation corresponding to a prior period omitted from previous filings.
   - `9`: Rectification / correction of an operation recorded in a prior period.
   `R.S. 286-2009/SUNAT — Reglas de Estados de Fila`

4. **BigInt formatting rule.** Amounts stored internally as integer cents (BigInt) must be
   formatted for PLE export with exactly two decimal places and dot decimal separator (e.g.
   `150050` integer cents formatted as `1500.50`), never scientific notation or trailing float artifacts.

5. **Cryptographic validation record.** The exported payload must be fingerprinted using
   SHA-256 before generation of the validation receipt, ensuring the PLE file matches the ledger
   state exactly.

## Operational steps

1. Ingest `ledger` entries corresponding to the requested `book-type` (e.g. `050100` for Libro Diario, `060100` for Libro Mayor) and `period`.
2. Map ledger attributes to the official PLE column schema per R.S. 286-2009/SUNAT.
3. Format monetary fields into decimal strings from BigInt integer cents.
4. Construct the pipe-delimited text buffer and calculate its SHA-256 digest (`hash-validation-record`).
5. Emit `ple-txt-payload` with the official 33-character filename and report any `export-diagnostics`.

## References

- Resolución de Superintendencia N° 286-2009/SUNAT — Dictan disposiciones para la implementación del Sistema de Libros Electrónicos (PLE).
- Resolución de Superintendencia N° 234-2006/SUNAT — Normas sobre libros y registros vinculados a asuntos tributarios.
- Resolución de Superintendencia N° 379-2013/SUNAT — Obligados a llevar Libros Electrónicos.
- Related skills: `pe.cierre-resultados`, `pe.sire-filing`.
- Status: draft from sources — pending domain review by a Peruvian accounting professional.
