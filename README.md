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

Fourteen namespaces are wiped. Verified against build output: `bg-slate-800`,
`text-red-500`, `p-4`, `gap-2`, `mt-8`, `space-y-4`, `w-64`, `rounded-lg`,
`font-sans`, `text-3xl`, `shadow-lg`, `inset-shadow-sm`, `drop-shadow-md`,
`text-shadow-lg`, `blur-sm`, `animate-spin`, `ease-in-out`, and `tracking-wide`
all produce **zero CSS**. No shadow token is declared in any of the four shadow
namespaces, so a box-shadow cannot be expressed through Tailwind at all.

Spacing is six named tokens — `hair` `tight` `field` `entry` `record` `section`
— and the bare `--spacing` multiplier is deliberately not declared, which is what
keeps `p-4` and every sibling dead. A seventh value is a conversation, not a
commit.

Two things to know before writing layout:

1. **A wiped class is silent, not an error.** Tailwind emits nothing and the
   build passes, so a misspelled token class like `text-ink-mute` ships unstyled.
   Lint rule is Phase 3.
2. **`leading-*` falls back to the spacing namespace.** This is a Tailwind
   behaviour the wipe cannot reach: every `--spacing-<name>` token silently
   creates a `leading-<name>` utility whose line-height is a *length*.
   `leading-tight` currently resolves to `line-height: 0.5rem`, and it is a name
   people type from muscle memory. `leading-record` is shadowed by the real
   `--leading-record`, so it is correct today — but deleting that token would
   silently turn it into `3rem` rather than breaking loudly. Only
   `leading-display`, `leading-prose`, and `leading-record` are intended.

Responsive variants (`md:`) and layout utilities (`flex`, `grid`) are unaffected;
they do not depend on any wiped namespace.

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

**A record is a container, not a page.** Articles are not their own accession
class; they are accruals filed under the record they discuss, the way a finding
aid describes a series.

```
src/content/records/
  2026.04-rochester-map/
    index.mdx                        -> records collection
    articles/
      01-overpass-extraction.mdx     -> articles collection
      02-projection-choice.mdx
```

Schemas live in `src/content.config.ts` and use `strictObject`, so an
unrecognized frontmatter key fails the build rather than being silently ignored.
`condition` is required on both collections — every record and every accrual
states its actual state.

Ids are generated by hand, not by Astro's default slugifier, which would turn
`2026.04-rochester-map` into `2026-04-rochester-map` and remove the one character
that makes `2026.04` an identifier rather than a date.

An article's parent accession is **injected as `record` before validation**, by
wrapping `parseData`. That ordering is deliberate: it makes `record` a required,
regex-checked schema field that appears in the generated types, so Phase 2 reads
`article.data.record` instead of re-parsing a path in a template. Anything
written in a `record:` frontmatter key is overwritten — the directory is the only
source of that fact.

`note` is the accrual's identifier within its record (`2026.04, note 3`). It is
**not** derived from the filename: the `01-` prefix is sort order for a directory
listing and can be renamed freely; an identifier cannot.

### Build-time guards

Three, all throwing — build stops, non-zero exit, no `dist/`. Each is tested in
both directions.

| Guard | Fails when |
|---|---|
| Accession uniqueness | Two records claim the same `acc` |
| Directory / frontmatter agreement | Directory `2026.07-x` holds `acc: '2026.08'` |
| Note uniqueness within a record | Two accruals under one record claim the same `note` |

Note uniqueness is scoped **per record**, verified: two different records may
each have a note 1.

`records/9999.01-placeholder/` proves the nesting typechecks — an `index.mdx` and
one article. `9999` is outside the assignable range, since accession years are
years of entry, so it cannot collide with a real record. **Deleted in Phase 1**,
when real records — written by hand, not generated — replace it.

## Status

Phase 0 complete: tokens, theme wipe, fonts, schemas, green build.
`/tokens-test` is a scratch instrument for tuning the palette; delete it at the
end of Phase 2. `/` is a holding page, not a design — Phase 2 owns it.
