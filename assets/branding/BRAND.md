# Drenyra Skills — Brand & Banner

> **Normative source:** the Drenyra ecosystem brand contract —
> [`drenyra-ai/contracts/brand-system.md`](https://github.com/arkelythex/drenyra-ai/blob/main/contracts/brand-system.md)
> (v0.2 DRAFT) and canonical tokens at `contracts/brand-system/tokens.json`.
>
> The ecosystem design system is **the same system as Drenyra apps/web**: one
> fused banner composition that transitions seamlessly from Black Dark OLED
> (pure `#000000`, left) to Dreamcoder Light (warm ivory, right) — plus the
> cyan/violet accent system (DTCG token pipeline) and the Dreamcoder-inspired
> compositional language (elevation, aurora glows, curved geometry, spark
> accents). Drenyra Skills must **not** invent its own palette.

## Regeneration prompt (ChatGPT Images 2.0)

> **Art direction (v2, Dreamcoder Light + Black Dark OLED):** see
> [gpt-image-prompts.md](https://github.com/arkelythex/drenyra-ai/blob/main/docs/assets/brand/gpt-image-prompts.md).
> Combine the Shared DNA block (section 4) with the product section below; the
> embedded prompt is the product section only and may trail the canonical file.

The canonical set lives in
[`drenyra-ai/docs/assets/brand/gpt-image-prompts.md`](https://github.com/arkelythex/drenyra-ai/blob/main/docs/assets/brand/gpt-image-prompts.md).
The Drenyra Skills prompt is the **layered folio system** motif:

```text
Subject: versioned accounting and tax knowledge rendered as a layered folio system. The hero on the right third is a stack of three overlapping knowledge folios made of smoked glass and matte anthracite surfaces, each slightly offset, with curved spines that open outward in a refined arc. Their edges are traced with cyan and violet accent light, extremely restrained.

Each folio bears a tiny abstract rule-glyph — not a literal symbol, but a minimal curved compliance sigil — in muted blue-gray. A success-green version marker hovers above the top folio with a soft halo, like a sanctioned release state. A single sweeping orbit passes behind the stack, binding the layers together.

The object should feel like living doctrine under version control: elegant, ordered, and auditable. No open-book cliché, no school notebook vibe, no generic education iconography. Signature detail: the minute luminous point resting on the curve tip of the top sigil.
```

## Validate

```bash
node ../drenyra-ai/scripts/brand-conformance.mjs \
  assets/branding/drenyra-skills-banner.png
# expect: ✓ <file> (coverage >= 0.92) ... PASS
```

The checker is referenced from the sibling-checkout layout: clone `drenyra-ai`
next to this repository so `../drenyra-ai/scripts/brand-conformance.mjs`
resolves (the same `../<repo>` layout `drenyra-ai/scripts/brand-ecosystem-status.mjs`
assumes) — no host-specific absolute path.

Iterate with the checker's off-palette feedback until coverage ≥ 0.92. Then
`bun run brand:ecosystem` in drenyra-ai must report this repo `PASS` before
brand-system can freeze to v0.3.

## Freeze gate

`brand-system` freezes to v0.3 only when every consuming repo (App Web, Pi,
Engram, Skills, Guardian Angel) passes the same checker on its brand assets in
both themes.
