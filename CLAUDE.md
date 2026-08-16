# CLAUDE.md

Standing context for this repository. Read fully before any work.

---

## Project

Personal site for Langston, a CS student at the University of Rochester who also runs a freelance web development practice. Audience is roughly 60% internship recruiters, 40% prospective freelance clients.

**The governing constraint: this site must not look like it was made in an afternoon by someone using AI.** There is no deadline. When speed and craft conflict, craft wins.

## Theme — Catalog

The site is **a register of works**, in the tradition of the museum registrar's accession record, the archival finding aid, and the herbarium specimen sheet.

This is a structural conceit, not a decorative one. There is no paper texture, no faux-aged anything, no map furniture, no ornament of any kind. The theme lives entirely in two places: the **field vocabulary** applied to metadata, and the **layout of a record**.

### What the tradition provides

- **The accession number is the identifier.** `2026.04` = the fourth work entered in 2026. It communicates output rate and history without any claim being made.
- **Provenance is a chain, not a description.** Where the work came from, what it was before, who else touched it. Admitting origin reads as confidence.
- **Condition notes are honest.** "Stable. Deps current as of Jun 2026." / "Known issue with Safari uploads." / "Archived — don't run it." This is the most differentiating field in the system and the one most likely to be softened into uselessness. Do not soften it.
- **Extent is measured.** `4,180 LOC · 118 commits · 7 weeks`. Never "a large-scale application."
- **Records are marked, never deleted.** Archived works stay in the register in muted ink with a status. This is what makes the site read as maintained rather than made.

### Field vocabulary

`ACC.` · `ACQUIRED` · `COMPLETED` · `MEDIUM` (never "stack" or "tech") · `EXTENT` · `PROVENANCE` · `CONDITION` · `LOCALITY` · `STATUS`

Accession numbers are `YYYY.NN`, assigned in order of entry, **never reused and never renumbered**. Status is one of `ACTIVE` / `SHIPPED` / `ARCHIVED`.

### Register language

Every word stays functional. The register is dry. **Never** write "collection," "curated," "showcase," "portfolio," or "journey." The moment the vocabulary becomes precious, the theme reads as a costume and the whole thing fails.

## Stack — settled, do not propose alternatives

- **Astro 5**, TypeScript strict
- **Vercel** hosting, `@astrojs/vercel` adapter, `output: 'static'` with server islands enabled
- **Tailwind v4** — with defaults wiped, see below
- **MDX in `src/content/`.** No CMS.
- Live data: GitHub REST called server-side inside an Astro server island, token in Vercel env, `Cache-Control: s-maxage=300`. No client JS, no extra vendor.
- Self-hosted variable fonts from `/public/fonts/`

Rejected, with reasons — do not reintroduce: Next.js (site is ~90% static documents), Convex (was sized for a realtime feature that no longer exists), any CMS (content is authored in-repo), Cloudflare (Vercel chosen), Google Fonts CDN (third-party request, no subsetting control), shadcn/ui or any component library (defaults are recognizable on sight).

## Tailwind configuration — mandatory

Tailwind is used **as a typed interface to the token system, not as a source of defaults.** The default scales must be unreachable. In `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-*: initial;
  --spacing-*: initial;
  --radius-*: initial;
  --font-*: initial;
  --text-*: initial;
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;
  --text-shadow-*: initial;
  --blur-*: initial;
  --animate-*: initial;
  --ease-*: initial;
  --tracking-*: initial;
  --leading-*: initial;

  --color-board:     #E4E5E0;
  --color-card:      #F7F7F4;
  --color-ink:       #22241F;
  --color-ink-muted: #6B6E66;
  --color-rule:      #C9CBC3;
  --color-stamp:     #6E4B7E;

  --font-record: "Commit Mono", ui-monospace, monospace;
  --font-prose:  "Source Serif 4 Variable", Georgia, serif;

  --text-xs:   0.66rem;
  --text-sm:   0.75rem;
  --text-base: 0.94rem;
  --text-md:   1.06rem;
  --text-lg:   1.56rem;
  --text-xl:   2.1rem;

  --leading-display: 1.2;
  --leading-prose:   1.65;
  --leading-record:  1.5;

  --tracking-label: 0.09em;

  --spacing-hair:     0.25rem;
  --spacing-pair:     0.5rem;
  --spacing-field:    0.75rem;
  --spacing-entry:    1.5rem;
  --spacing-register: 3rem;
  --spacing-section:  6rem;
}
```

`--color-*: initial` is load-bearing. It makes `bg-slate-800` a build error rather than a convenient shortcut. Same for spacing, radius, and type scale. **If a utility class references a value not declared in `@theme`, that is a bug, not a shortcut.**

No shadow token is declared in any of the four shadow namespaces. A box-shadow is not discouraged; it is inexpressible through Tailwind.

### Spacing

Six values, named by intent, never by number. The bare `--spacing` multiplier is **not** declared — declaring it restores `p-4`, `gap-2` and every sibling in one line.

| Token | Value | Intent |
|---|---|---|
| `hair` | `0.25rem` | Optical nudge; label to the value under it |
| `pair` | `0.5rem` | Stacked lines inside one field |
| `field` | `0.75rem` | Field to field within a rail |
| `entry` | `1.5rem` | Padding inside a record; entry to entry |
| `register` | `3rem` | Record to record; subsection break |
| `section` | `6rem` | One movement of the page to the next |

`pair` and `register` are named to dodge a Tailwind collision, not for taste. Tailwind resolves `leading-<name>` against the spacing namespace when the leading namespace has no match, so `--spacing-tight` made `leading-tight` mean `line-height: 0.5rem`, and `--spacing-record` left `leading-record` correct only by being shadowed. Do not rename them back. Full reasoning in `design-directions.md`.

A seventh spacing value is a conversation, not a commit.

## Color

| Token | Value | Role |
|---|---|---|
| `board` | `#E4E5E0` | Cool gray-green ground — the mount a specimen is fixed to |
| `card` | `#F7F7F4` | Neutral off-white — the record itself |
| `ink` | `#22241F` | Near-black, faint olive — body text |
| `ink-muted` | `#6B6E66` | Labels, metadata, archived entries |
| `rule` | `#C9CBC3` | Hairlines |
| `stamp` | `#6E4B7E` | Aniline violet, from library date stamps |

Discipline:

- `stamp` is used **only** for accession numbers, live-data indicators, and focus rings. It is the scarcest ink — if a page uses it more than four times, it is wrong.
- Depth comes from the `card`-on-`board` value step. **No box-shadows anywhere.**
- **No gradients anywhere.**
- **Never** introduce a warm cream ground (near `#F4F1EA`) or a terracotta / burnt-orange accent (near `#D97757`). That pairing is the current signature of AI-generated design and its presence defeats the project's purpose.

## Type

**There is no sans-serif in this system.** Two faces, and the assignment is a rule, not a preference:

| Face | Used for | Source |
|---|---|---|
| **Commit Mono** | Every record field, label, number, date, status, accession | commitmono.com — manual download |
| **Source Serif 4 Variable** (`wght`, `opsz`) | Every piece of prose, including all headings | Google Fonts, OFL |

The justification for mono on metadata is that catalog cards were *typed*. It is not a developer-aesthetic choice, and it should not drift into one.

Forbidden faces: Inter, Roboto, Open Sans, Poppins, Montserrat, and `system-ui` in any visible role.

**The field label** is the defining type move: Commit Mono, uppercase, 10px, `letter-spacing: 0.09em`, `ink-muted`. It appears above nearly every value on the site.

Scale — 1.25 ratio:

```
--text-xs: 0.66rem   --text-sm: 0.75rem   --text-base: 0.94rem
--text-md: 1.06rem   --text-lg: 1.56rem   --text-xl: 2.1rem
```

Leading: `1.2` display, `1.65` prose, `1.5` record fields.

## Forbidden patterns

- Full-viewport sections with a centered heading and a shared max-width container
- The same max-width container repeated on every page
- Uniform fade-up-on-scroll
- Three-card grids
- Uniform border-radius and box-shadow across unrelated elements
- A skills section in any form; skill bars; percentage proficiencies
- Emoji section headers
- Gradient text, glassmorphism, particle backgrounds, cursor trails, magnetic hover, scroll-jacking
- Numbered section markers (01 / 02 / 03). Accession numbers are permitted **because they carry real information**; decorative sequence numbers are not.
- Copy that describes competence rather than demonstrating it
- Tutorial projects presented as original work

**Watch specifically for broadsheet collapse.** Hairline rules plus dense columns is one of the three current AI-design defaults. What keeps this system clear of it is the `card`-on-`board` value step and the asymmetric metadata rail — not newspaper columns.

## Layout principle

**Each page is laid out for its own content.** The register (`/work`) is a tabular list. A record (`/work/[acc]`) is an asymmetric split — a narrow left rail of `LABEL` / value pairs against a wide prose column. These must not share a grid. If two sections could be swapped without anyone noticing, one of them is wrong.

Structural devices must encode something true. A rule that marks a real boundary is fine; a rule added for rhythm is decoration.

## Content principle

Density of specifics is the anti-slop mechanism. Dates, versions, durations, proper nouns, real measured numbers.

> "Reduced p99 from 840ms to 120ms by replacing the N+1 in the availability query"

costs nothing to write and cannot be generated without the underlying work. Prefer that to any adjective.

**The 30-second read is non-negotiable.** A recruiter needs medium, status, and outcome fast. Accession vocabulary decorates the metadata rail; it never crowds out the summary line.

Never write placeholder or lorem copy into a committed page. If real content doesn't exist yet, the page doesn't get built yet.

## Quality floor

- Semantic HTML; readable and navigable with JavaScript disabled
- Visible keyboard focus rings in `stamp`
- `prefers-reduced-motion` respected on every transition
- No layout shift; fonts declared `font-display: swap` with explicit `unicode-range`
- Responsive to 360px with no horizontal scrollbar. The record's rail/prose split collapses to stacked; the rail goes first.
- Sensible tab order throughout

## Phase map

Phases do not run out of order.

| # | Phase | Contents |
|---|---|---|
| 0 | Foundation | Tokens, Tailwind theme wipe, fonts, schemas, green deploy |
| 1 | Content | All records written by hand — **by Langston, not by Claude** |
| 2 | Register + records | `/`, `/work`, `/work/[acc]`, `/writing`, `/writing/[slug]`, `/about` — static, zero client JS |
| 3 | Craft layer | 404, colophon, `/now`, per-page OG images, RSS, sitemap, view transitions, a11y pass |
| 4 | Signature | GitHub instrument panel — server island, live data renders in `stamp` |
| 5 | — | Resolved: the Overpass SVG map is catalogued as its own record, `2026.04`. No separate phase needed. |
| 6 | Vote feature | Conditional. Only if 0–4 are live and it still appeals. |

**Phase 2 does not begin until real content exists.** Designing around placeholder text is the specific mechanism that produces identical sections — with nothing particular to respond to, every section gets the same container.

## Working agreements

- Confirm the plan in a few lines before executing a phase.
- Do not scope-creep across phase boundaries. If something from a later phase seems necessary now, say so and stop.
- Do not optimize for preserving work already done. If an earlier decision is wrong, say it's wrong.
- Prefer deleting to adding. Before finishing a page, remove one element.
- When a choice is between "correct" and "impressive," pick correct.