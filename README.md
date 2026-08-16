# personal-site

A register of works. Astro 7, TypeScript strict, Tailwind v4 with its default
scales wiped, static output on Vercel.

Read `CLAUDE.md` before changing anything — it holds the stack decisions, the
Catalog theme, the token system, the forbidden patterns, and the phase map, and
it takes precedence over this file. `design-directions.md` records why the theme
is what it is and which alternatives were rejected, so settled questions stay
settled.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run check` | `astro check` — strict TS + content schema validation |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the build locally |

## Deploy

Vercel, building from `main`. Framework preset **Astro**; the defaults are
correct and need no override.

The `@astrojs/vercel` adapter is configured but nothing renders on demand yet. It
is wired so the Phase 4 GitHub instrument panel can become a server island
without a config change. Until then every route is prerendered.

Note: `npm audit` reports 3 high-severity advisories in `path-to-regexp`, reached
through `@vercel/routing-utils` inside `@astrojs/vercel` 11.0.5 — the current
release. It is a build-time dependency and none of it reaches the browser.
`npm audit fix --force` would downgrade the adapter and break the build. Leave it
until upstream ships a fix.

## Tailwind

Tailwind is a **typed interface to the token system, not a source of defaults.**
`src/styles/global.css` wipes five namespaces with `--color-*: initial` and
friends, then declares only the tokens from `CLAUDE.md`.

Verified in Phase 0: `bg-slate-800`, `text-red-500`, `p-4`, `gap-2`,
`rounded-lg`, `font-sans`, and `text-3xl` all produce **zero CSS**. Note that the
build does *not* fail on them — Tailwind emits nothing silently, so a misspelled
token class ships as unstyled rather than as an error.

Three consequences worth knowing before writing any layout:

1. **There is no spacing scale.** `p-4` and `gap-2` do nothing. Only arbitrary
   values (`p-[1.5rem]`) work. Phase 2 has to decide whether to declare a named
   spacing scale or commit to arbitrary values.
2. **`shadow-lg`, `blur-sm`, `animate-spin`, `tracking-wide`, and `leading-tight`
   are still reachable** — those namespaces are not in the wipe. `CLAUDE.md`
   forbids box-shadows, but nothing currently enforces it.
3. Responsive variants (`md:`) and layout utilities (`flex`, `grid`) are
   unaffected; they do not depend on the wiped namespaces.

## Fonts

Self-hosted from `public/fonts/`, latin subset, `font-display: swap`, explicit
`unicode-range`. No requests to `fonts.googleapis.com`, `fonts.gstatic.com`, or
any other origin — verified against the build output.

| Face | File | Axes | License |
|---|---|---|---|
| Source Serif 4 Variable | `source-serif-4-variable-latin.woff2` | `wght` 200–900, `opsz` 8–60 | OFL, included |
| Commit Mono | `commit-mono.woff2` | — | **not present** |

**Commit Mono is missing.** It is not on Google Fonts and is not fetchable
programmatically; download it from [commitmono.com](https://commitmono.com),
convert to woff2 if needed, and place it at `public/fonts/commit-mono.woff2`.

This is not a minor gap. There is no sans-serif in this system — Commit Mono
carries every record field, label, number, date, status, and accession, and it is
`.field-label` itself. Until the file lands, all of that falls back to the
platform monospace, the build prints a warning naming the file, and `/tokens-test`
shows it plainly. If what you have is the static 400 rather than the variable
release, narrow `font-weight: 200 700` to `400` in `src/styles/global.css`.

## Content

MDX in `src/content/`, schemas in `src/content.config.ts`. Schemas use
`strictObject`, so an unrecognized frontmatter key fails the build rather than
being silently ignored.

`condition` is required on every project. That is deliberate — every record
states its actual state.

**Accession uniqueness is enforced at build time.** `src/content.config.ts` wraps
the `glob()` loader and sweeps the whole collection for duplicate `acc` values
after loading. A collision throws, the build stops with a non-zero exit, and no
`dist/` is produced. Numbers are never reused, and the build does not trust
anyone to remember that.

`_placeholder.mdx` in each collection exists only to prove the schemas typecheck
against a real entry. Its accession is `2026.00`, outside the assignable range, so
it cannot collide with a real record or consume a number one should have had.
**Both are deleted in Phase 1**, when real records — written by hand, not
generated — replace them.

## Status

Phase 0 complete: tokens, theme wipe, fonts, schemas, green build.
`/tokens-test` is a scratch instrument for tuning the palette; delete it at the
end of Phase 2. `/` is a holding page, not a design — Phase 2 owns it.
