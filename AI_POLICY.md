# AI-Assisted Contribution Policy

AI-assisted contributions are permitted. The human contributor must understand, review, validate, and take full responsibility for everything they submit — especially when it touches fiscal knowledge.

> [!IMPORTANT]
> **Fiscal correctness is a product safety requirement.** A contribution that fabricates a tax rule, misquotes a norm, or drifts the registry from the runtime is a product defect regardless of who or what authored it. The contributor owns the submission; AI assistance does not transfer that ownership.

## Human Responsibility

The human contributor remains fully responsible for:

- The correctness and ongoing maintenance of the complete submission.
- Reviewing and validating every change, claim, and test result — including registry entries and cited normative sources.
- Verifying that every normative statement in a skill cites its real source (norm, article, or runbook).
- Ensuring appropriate licensing and confidence in the provenance of submitted material.
- Explaining and defending the design, scope, and tradeoffs during review.
- Verifying that content invariants hold: no fabricated rules, RUC/period scope where fiscal context applies, integer cents (BigInt) for money, version discipline in `registry.json`.

AI assistance does not transfer authorship, accountability, or legal responsibility away from the contributor.

## Disclosure

Disclose material AI assistance used to produce or substantively review any part of a contribution, including:

- Skill content, rules, or references.
- Registry manifests, schemas, or templates.
- Documentation.
- Substantive review, investigation, or analysis.

For material assistance, the pull request declaration must state:

1. The tool or model, if known.
2. The material scope of the assistance.
3. The verification the contributor performed.

Raw prompts and private conversation logs are not required by default.

Trivial formatting, spelling corrections, minor autocomplete, search or navigation, and trivial, non-substantive mechanical transformations do not require disclosure.

## Review and Attribution

Maintainers may request an explanation, prompt summary, provenance information, supporting evidence, or additional verification. They may reject work that the contributor cannot explain, verify, or defend — especially knowledge whose normative source cannot be produced.

AI tools must not receive human attribution, including `Co-Authored-By`, `Reviewed-by`, `Tested-by`, `Signed-off-by`, approval, or equivalent credit. An optional `Assisted-by` trailer may be accepted, but the pull request declaration is sufficient.

## Submission Quality

Review is based on observable submission quality, not on whether text or code appears to be AI-generated. Before proposing a fix, contributors should identify the underlying cause and the responsible invariant, then explain and defend why the change is proportionate. Prefer the smallest change that restores that invariant.

Unacceptable behavior includes:

- Submitting output that the contributor has not reviewed.
- Making claims that cannot be verified or reporting results that did not occur.
- **Inventing fiscal rules, norms, articles, rates, skills, or references** — every normative claim must cite its source.
- Silently editing a skill's version or canonical fields without the registry and conformance implications.
- Masking a symptom or leaving the responsible invariant broken (for example, fixing a doc without bumping its version).
- Adding broad or unrelated changes outside the approved scope.
- Copying output without confidence in its provenance or license compatibility.
- Being unable to explain the change, its design, or its consequences.
- Delegating the work of understanding, validating, or repairing the submission back to maintainers.

## Enforcement

For now, maintainers enforce this policy through reviewer judgment and documented review decisions only. The project does not use automated AI detection or an automated disclosure gate.
