# Design directions

Written 15 August 2026, end of Phase 0.

This file exists so the theme does not get relitigated in a later session by
someone — including a future Claude, including a future me — who has lost the
reasoning and only has the artifact. Six directions were considered. One won.
The five that lost are recorded with the specific reason they lost, because "we
tried that" is not an argument and will not survive contact with a
plausible-sounding suggestion six weeks from now.

To reopen one of these, the bar is a new fact, not a new opinion.

---

## The governing constraint

The site must not look like it was made in an afternoon by someone using AI.

That is harder than "look good," and it rules out a large class of otherwise
defensible designs. A centered hero over a full-viewport section, a three-card
grid, uniform fade-up-on-scroll, one max-width container reused on every page —
none of these are ugly. They are *legible as a default*. A recruiter who has
opened forty portfolio sites this month recognizes them in under a second, and
what they recognize is not the design; it is the absence of a decision.

So the direction had to be one where the structure encodes information. Not a
theme applied over content, but a system where a field name means something, a
rule marks a real boundary, and a second ink means a different kind of data.
Anything decorative can be produced without the underlying work. Anything
informative cannot.

---

## The direction that won: Catalog

**The site is a register of works.**

This is a structural conceit, not a decorative one. There is no paper texture,
no faux-aged anything, no map furniture, no ornament of any kind. The theme
lives in exactly two places: the **field vocabulary** applied to metadata, and
the **layout of a record**. Everything else is ordinary typography.

That narrowness is the reason it survives contact with real content. A theme
that lives in ornament has to keep producing ornament; a theme that lives in
vocabulary and layout gets *stronger* as more records are entered.

### The four source traditions

Each contributes one specific mechanism, not a mood.

**The museum registrar's accession record** contributes the identifier.
`2026.04` is the fourth work entered in 2026. It communicates output rate and
history without any claim being made — no "prolific," no "shipping fast," just a
number that happens to be the fourth. It is also the only permitted numbered
marker on the site: decorative `01 / 02 / 03` section numbers are forbidden
precisely because they look like this and carry nothing.

**The archival finding aid** contributes provenance as a *chain* rather than a
description. Where the work came from, what it was before, who else touched it.
A finding aid never pretends a collection sprang into being complete, and
admitting origin reads as confidence. "Forked from an internal tool, rewritten
twice" is a stronger sentence than any adjective available.

**The herbarium specimen sheet** contributes two things. First, the physical
relationship the palette encodes: a specimen is *mounted on a board*, and the
whole visual system is a `card` fixed to a `board` with a value step and no
shadow. Second, condition notes — a herbarium sheet records that a specimen is
damaged, because a sheet that only recorded healthy specimens would be useless
for research. This is where `CONDITION` comes from, and it is the field most
likely to be softened into uselessness.

**The auction catalogue** contributes measured extent and the discipline of the
dry register. A catalogue states `4,180 LOC · 118 commits · 7 weeks`, never "a
large-scale application," because a catalogue that inflates is worthless to the
person reading it to make a decision. It also supplies the prohibition: the
moment the vocabulary becomes precious — "collection," "curated," "showcase" —
the theme reads as a costume and the whole thing fails.

### Why this one

Two properties no styling choice can be given.

**It cannot be faked by generation.** `CONDITION: Stable. Deps current as of Jun
2026. Two known issues in Safari 17 uploads.` cannot be written without having
maintained the thing. `EXTENT: 4,180 LOC · 118 commits` cannot be written
without having counted. The theme's own field vocabulary demands facts that only
exist downstream of the work — the structure is an *interrogation* of the
content, and thin content fails visibly rather than hiding behind a container.

**It makes maintenance visible.** Records are marked, never deleted. An archived
work stays in the register in muted ink with a status, which is what makes the
site read as maintained rather than made. A portfolio that silently drops old
work looks like it was assembled once. A register that shows `ARCHIVED — don't
run it` looks like something someone has been keeping.

### Palette sourcing

Six inks, and the constraints are structural rather than aesthetic.

```
board      #E4E5E0   cool gray-green ground — the mount a specimen is fixed to
card       #F7F7F4   neutral off-white — the record itself
ink        #22241F   near-black, faint olive — body text
ink-muted  #6B6E66   labels, metadata, archived entries
rule       #C9CBC3   hairlines
stamp      #6E4B7E   aniline violet, from library date stamps
```

**The ground is cool, not warm.** This is the most important value in the file
and it is important defensively. The current signature of AI-generated design is
a warm cream ground near `#F4F1EA` with a terracotta accent near `#D97757`. That
pairing is now recognizable on sight, and a site carrying it announces its own
origin regardless of the work behind it. **A warm cream ground and a
terracotta/burnt-orange accent are permanently out of scope.** Not "avoid unless
it works" — out of scope.

**Depth is the `card`-on-`board` value step, and nothing else.** No box-shadows
anywhere. A specimen sheet has no lighting model; the record is fixed flat to
the mount. This means the two lightest values carry the entire spatial system,
which is why the token test sheet leads with that pair rather than with the
swatch grid.

**`stamp` is rationed to three uses**: accession numbers, live-data indicators,
and focus rings. More than four occurrences on a page is wrong. The live-data
reservation is the highest-leverage rule here — when the Phase 4 GitHub panel
ships, violet will already mean *this is a real identifier or this is changing*
on every page the visitor has scrolled through, so the live region will read as
live without a badge, a pulsing dot, or a "updated 4 minutes ago" caption.

**No gradients.** Same reason. Flat printing, flat mount.

### What Catalog costs

Recorded honestly, because a direction with no downside was not examined hard
enough.

- **It is unforgiving of thin content.** Every record must state its condition,
  its extent, and its provenance. A project without enough substance to fill
  those fields looks worse in this system than it would in a generic card. This
  is the constraint doing its job, and it is why Phase 2 cannot start until real
  content exists — but it does mean weak entries have nowhere to hide.
- **The vocabulary is one bad word from costume.** "Collection," "curated,"
  "showcase," "journey," an ornamental flourish, a serif that tries to look old —
  any one of them collapses the whole thing into theming. The register has to
  stay dry, permanently, including in copy written months from now in a hurry.
- **Mono on metadata risks reading as developer-aesthetic.** The justification is
  that catalog cards were *typed*. That is a real reason, but it is invisible to
  a viewer, and the failure mode — looking like every terminal-themed dev
  portfolio — is a real risk that has to be managed by keeping mono strictly on
  fields and never on prose.
- **Watch for broadsheet collapse.** Hairline rules plus dense columns is one of
  the current AI-design defaults. What keeps this system clear of it is the
  value step and the asymmetric rail, not the rules. If the rules start doing the
  structural work, the system has drifted.

---

## Rejected: Survey

The site as a USGS 7.5-minute topographic quadrangle sheet — contour hairlines, a
neatline, marginal annotation, a legend, hydrography cyan reserved for live data.

**Why it lost:** it was derived from an artifact that no longer anchors the site.
The direction existed because of a hand-built static SVG map of Rochester,
projected from real OpenStreetMap Overpass geometry into a 1000×700 viewBox. That
map was the strongest thing in the repo and the theme was downstream of it.

Once the map stopped being the centerpiece, the entire quadrangle apparatus was a
costume with nothing underneath. Contour brown, a neatline, and a legend on a site
that is not a map is exactly the decorative theming this project exists to avoid —
and worse, it would have been *elaborate* decoration, which reads as effort spent
on the wrong thing.

Catalog inherits what actually mattered: a restricted flat palette, an ink
reserved for live data, small typed annotation labels, and structure that carries
information. It just attaches them to something the site genuinely is — a register
of works — rather than to a metaphor it had outgrown.

**The map is not lost.** It is catalogued as its own record, `2026.04`, which is
a better outcome than being the theme: as a record it can state its own extent and
condition, which is a stronger claim than being wallpaper.

---

## Rejected: Instrument

The site as a measuring device or dashboard — live readouts, gauges, monitored
values, everything framed as telemetry.

**Why it lost:** it promises continuously updating data that does not exist. One
live region is planned, the Phase 4 GitHub panel, and it refreshes on a five-minute
cache. An instrument theme applied to a site that is 95% static documents means
building gauges for numbers that never move, which is a lie told in layout — the
most quietly embarrassing kind, because the visitor discovers it by watching
nothing happen.

It also collides with the audience. A recruiter needs medium, status, and outcome
inside thirty seconds. Instrument panels optimize for *monitoring a known system*,
not for orienting a first-time reader, and would bury the summary line under
chrome.

Catalog keeps the one genuinely live thing and gives it `stamp`, so it reads as
live precisely because nothing else on the page does.

---

## Rejected: Decision / Payoff

Every project presented as a decision record — the constraint, the options
weighed, the choice, the measured result.

**Why it lost:** it is the right *content* structure and the wrong *site*
structure, and adopting it as a theme would have forced it onto work that does
not fit. Not every record has an interesting decision at its center. Some are "a
client needed a booking system and I built one well." Under a decision theme
those records have to manufacture a dilemma, which produces exactly the inflated
retrospective narration the content principle forbids.

There is a second failure: it is a *long-form* structure, and it makes the
thirty-second read impossible. A recruiter scanning for medium and status should
not have to parse a narrative to find them.

The good part is kept without the theme. `CONDITION` and `EXTENT` are fields, so
the honest measured detail appears in the rail on every record, and the prose
column is free to tell the decision story only when there genuinely was one.

---

## Rejected: Spec / RFC

The site as a technical specification — numbered sections, RFC 2119 keywords,
normative language, a document that reads like it was submitted to a standards
body.

**Why it lost:** it is a joke that stops being funny on the second page, and it
is unreadable to 60% of the audience. Recruiters are not all engineers, and
freelance clients are mostly not. A conceit that requires the reader to know the
RFC format to get it is a conceit that excludes the people the site is for.

It is also the closest of the five to pure costume. RFC formatting does not
encode anything about the work — numbered sections are just numbering, and
`MUST`/`SHOULD` are borrowed authority rather than earned. Compare with
`CONDITION`, which cannot be filled without having maintained the thing.

And it fails the forbidden-patterns list on its own terms: numbered section
markers are prohibited unless the content genuinely is an ordered sequence. A
portfolio is not.

---

## Rejected: No conceit

No theme at all. Excellent typography, careful spacing, real content, nothing
else. Let the work speak.

**Why it lost:** this was the most serious contender and it lost on a narrow,
specific point — it has no mechanism for forcing specificity.

Everything good about it is true. It cannot become a costume, it cannot age
badly, and it never gets in the content's way. But "no conceit" executed at a
high level converges on a look that is now the *default* for careful developer
portfolios: generous whitespace, one serif, one mono, hairline rules, a muted
palette. That is not a failure of taste; it is a failure of distinctiveness, and
it lands in the same place the governing constraint is trying to escape, just via
better craft.

The decisive argument is structural rather than visual. With no field vocabulary,
nothing *compels* a record to state its condition or count its extent. Writing
"a large-scale React application" stays available, because no empty field is
sitting there demanding a number. Catalog's fields are a forcing function: the
rail has a `CONDITION` slot and a blank one is visibly blank.

A conceit that makes the honest version of a sentence the easy one earns its
keep. That is the whole case for Catalog over nothing.

---

## Findings from Phase 0 / 0.1

Recorded here because they constrain Phase 2 and were discovered by testing, not
by reading docs.

**The `@theme` wipe works, but it does not error.** The wiped namespaces make
`bg-slate-800`, `text-red-500`, `p-4`, `gap-2`, `rounded-lg`, `font-sans` and
`text-3xl` produce **zero CSS output**. The build does *not* fail — Tailwind
silently emits nothing. So the wipe removes the convenience but not the footgun:
a typo like `text-ink-mute` also silently produces nothing and ships as
unstyled. Lint rule deferred to Phase 3.

**The wipe was finished in Phase 0.1.** Phase 0 shipped with five namespaces
wiped, which left `shadow-lg`, `blur-sm`, `animate-spin`, `tracking-wide` and
`leading-tight` reachable — a box-shadow was forbidden by CLAUDE.md but one
keystroke away. Nine more namespaces were added, including all four shadow
namespaces, and no shadow token is declared in any of them. A box-shadow is now
inexpressible through Tailwind rather than merely discouraged.

**Spacing is six tokens, named by intent, and the numeric scale stays dead.**
`hair` `pair` `field` `entry` `register` `section` — shipped in 0.1 as `hair`
`tight` `field` `entry` `record` `section` and renamed in 0.2, for the reason in
the next section. The bare `--spacing`
multiplier is deliberately not declared — declaring it would restore `p-4` and
every sibling in one line. Verified dead: `p-4`, `gap-2`, `mt-8`, `space-y-4`,
`w-64`, `m-2`, `px-6`, `h-96`.

### The `leading-*` collision, and why two tokens are named oddly

This is the finding most likely to be rediscovered the hard way, so it is
written out in full.

**What Tailwind does.** `leading-<name>` resolves against `--leading-*` first
and falls back to `--spacing-*` when there is no match. The fallback is
structural in the utility, not a theme value, so **`--leading-*: initial` cannot
prevent it.** Declaring a spacing token therefore also declares a line-height
utility of the same name, whose value is a *length* — and in this system
line-height is unitless (1.2 / 1.65 / 1.5), so a length is a category error that
still renders plausibly.

Phase 0.1 shipped six spacing tokens and got six of these for free. Two were
dangerous:

- **`leading-tight` meant `line-height: 0.5rem`.** `tight` is a name typed from
  muscle memory, from every other Tailwind project in existence. It would have
  been written by accident and looked merely "off" rather than broken.
- **`leading-record` was correct for the wrong reason.** `--leading-record: 1.5`
  shadowed `--spacing-record: 3rem`, so it worked — but deleting the leading
  token would have silently changed the value to `3rem` rather than breaking the
  class. A value that is right by coincidence is not right.

**The fix, and the two that were rejected.** Phase 0.2 renamed
`--spacing-tight` → `--spacing-pair` and `--spacing-record` → `--spacing-register`.

- *Rejected: a `@utility` override* re-declaring `leading-tight` as something
  sane. That adds surface to fight a collision, and leaves the trap in place for
  the next name that collides.
- *Rejected: declaring `--leading-tight` explicitly* to shadow the spacing value.
  That is the `leading-record` situation deliberately — correct by shadowing, one
  deletion away from silently wrong.
- **Renaming costs nothing and removes the collision rather than covering it.**
  `pair` and `register` are names nobody reaches for by accident, and they are
  better intent names anyway: `pair` is two lines that belong together, and
  `register` is the thing the site is.

**The surviving four are known-and-wrong, deliberately.** `leading-hair`,
`leading-field`, `leading-entry` and `leading-section` still exist and still mean
lengths. They were left because nobody types them by accident, and chasing every
one would mean naming the whole spacing scale around a Tailwind implementation
detail. Only `leading-display`, `leading-prose` and `leading-record` are
intended.

**This is the input to the Phase 3 lint.** The rule must check against an
**allowlist of intended utilities**, not merely flag unknown ones — these four
are known to Tailwind and wrong for this project, so an unknown-class check would
pass them.

### The rest of the collision surface

Phase 0.2 probed 94 utility families against all six spacing names. 49 families
resolve them. Only `leading-*` is a category error; the other 48 take a genuine
length, so the CSS is valid and the risk is different — they quietly widen the
API surface with utilities nobody designed:

```
padding      p px py pt pr pb pl ps pe
margin       m mx my mt mr mb ml ms me
gap          gap gap-x gap-y
size         w min-w max-w h min-h max-h size basis
position     inset inset-x inset-y top right bottom left start end
transform    translate translate-x translate-y translate-z
scroll       scroll-m scroll-mt scroll-p scroll-pt
misc         indent border-spacing
```

Nothing here was fixed, per the Phase 0.2 brief — the inventory is the
deliverable. The ones worth a decision later are the *size* families:
`max-w-section` (6rem) and `w-register` (3rem) read plausibly but were never
designed as widths, and the token sheet already treats container width and prose
measure as explicitly not-spacing.

Confirmed clean, for the record: `tracking-*`, `text-*`, `font-*`, `rounded-*`,
`blur-*`, `shadow-*`, `duration-*`, `opacity-*`, `z-*`, `columns-*`, `aspect-*`,
`border-*`, `outline-offset-*`, `ring-offset-*`, `underline-offset-*`,
`decoration-*` and `stroke-*` do **not** fall back to the spacing namespace.

**Three places on the token sheet are not spacing and stay arbitrary.** Reported
rather than papered over, per the Phase 0.1 brief. None of them indicate the
scale is wrong — they indicate they are not spacing:

- Swatch chip height (`h-[4.5rem]`) — a specimen dimension. How much ink you need
  to see to judge a colour is not a spacing question.
- The ink-on-ink grid gap (`gap-[1px]`) — a hairline abutment. The two grounds
  have to nearly touch for the value step between them to be judgeable.
- Prose measures (`max-w-[54ch]`, `[60ch]`, `[62ch]`, `[68ch]`) and container
  widths (`max-w-[72rem]`, `min-w-[14rem]`, `md:grid-cols-[15rem_1fr]`) — measure
  is a function of the face, and track sizing is layout. Neither belongs to a
  spacing scale.

Everything that *is* spacing on the sheet now uses a named utility.

---

## Findings from Phase 0.3

### Building Commit Mono

An earlier phase recorded that Commit Mono "is not fetchable programmatically."
That was wrong. The *customizer* on commitmono.com bakes settings in-browser and
cannot be scripted, but the source repo publishes the built variable font
directly, and the defaults are what this system wants anyway. The face was
built, not hand-downloaded, and the commands below reproduce the exact artifact
in `public/fonts/`.

**Source, and the checksum that gates it.**

```
https://raw.githubusercontent.com/eigilnikolajsen/commit-mono/main/src/fonts/fontlab/CommitMonoV143-VF.woff2
https://raw.githubusercontent.com/eigilnikolajsen/commit-mono/main/LICENSE-FONT

86,768 bytes
sha256  f342ca6c3f2597e6c0fcd84b3f3ed64d3ce5bdb6d0af19d190d645a558b1cf29
```

Verify the checksum before building. A mismatch means upstream changed the
release, and the correct response is to stop and look at it, not to ship a face
nobody has seen. Upstream axes are `wght` 200–700 and `ital` 0–1.

**The two build steps.** `fontTools` and `brotli` are build-time only and are
deliberately **not** in `package.json` — the repo ships the built font, not the
pipeline. Run them in a throwaway venv and delete it afterwards.

```sh
python -m fontTools.varLib.instancer \
  CommitMonoV143-VF.woff2 ital=0 -o CommitMono-ital0.ttf

python -m fontTools.subset CommitMono-ital0.ttf \
  --unicodes=U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD \
  --flavor=woff2 --name-IDs='*' \
  --output-file=commit-mono-variable-latin.woff2
```

Step 1 pins the italic axis out: prose italics come from Source Serif, nothing
in this system sets a slanted field value, and the axis is not free. Step 2
subsets to latin **without** pinning `wght` — the whole point of the variable
release is that 450 costs nothing, so instancing the weight would throw away the
reason for using it.

**Result: 16,544 bytes.** The brief predicted 26–27 KB, so the gap was treated
as a symptom and checked rather than accepted. It is real: `fvar` carries `wght`
200–700 and no `ital`, `gvar` is present, and the outlines genuinely move —
`A` is `(31, 0, 569, 700)` at wght 200 and `(23, 0, 577, 700)` at wght 700. 246
glyphs, 238 mapped codepoints, nothing above U+206F that is not on the
allowlist. The saving is the dropped italic masters plus the `cv01–cv11` /
`ss01–ss05` feature sets, which this project does not use.

Naming follows `source-serif-4-variable-latin.woff2` rather than the
`commit-mono.woff2` the old `@font-face` guessed at:
`commit-mono-variable-latin.woff2`, with `CommitMono-OFL.txt` beside it — the
face is SIL OFL 1.1, same as Source Serif.

**Coverage note.** The requested range is the standard Google latin superset and
both faces are missing some of it — Commit Mono has no `U+02BB`/`U+02BC` okina,
neither face has the full `U+2000-206F` block. The `unicode-range` is left as
specified because the two faces are then declared identically and the gaps are
in characters this site does not set. This is not drift; it is the same
superset Source Serif already shipped with.

### `--font-weight-*` was missed by both wipes

Phase 0 wiped five namespaces, Phase 0.2 added nine more, and `--font-weight-*`
survived both — `font-bold`, `font-medium` and the other seven were still
emitting. Same class of hole as the shadows: a system with two variable faces
and a small set of intended weights does not want Tailwind's nine.

**Three weights are declared, and the names are constrained rather than
chosen.** `font-<name>` resolves against the family namespace *and* the weight
namespace, so a weight named `record` or `prose` would shadow the family of the
same name — precisely the collision that cost Phase 0.2 a session. `display`,
`prose` and `record` are additionally taken by `--leading-*`. And no name may
reuse a Tailwind default weight name, because resurrecting `medium` with a
different number is worse than leaving it dead.

| Token | Value | Utility resolves to | For |
|---|---|---|---|
| `--font-weight-body` | `400` | `font-body` → `font-weight: 400` | Running prose, Source Serif |
| `--font-weight-typed` | `450` | `font-typed` → `font-weight: 450` | Every Commit Mono record field |
| `--font-weight-strong` | `600` | `font-strong` → `font-weight: 600` | Headings, `strong`, `b`, `th` |

`typed` is 450 **by decision, not by default** — the designer's recommendation is
400 on dark grounds and 450 on light, and this site is light throughout. The
name is CLAUDE.md's own justification for mono on metadata: catalog cards were
typed.

`strong` at 600 is the one genuinely new design decision in this phase. The UA
stylesheet sets `bold` on all six headings and on `strong`/`b`/`th`, and `bold`
is a keyword that means 700 regardless of what this system thinks — so the
choice was between 700 by accident and a number on purpose. It is restated in
the base layer and lives in one place. Revisit it in Phase 2 against real
headings.

Verified: all nine of `font-thin` `font-extralight` `font-light` `font-normal`
`font-medium` `font-semibold` `font-bold` `font-extrabold` `font-black` emit
nothing. `font-record` and `font-prose` still emit `font-family`; the three
above emit `font-weight`. No shadowing in either direction — `font-record
font-typed` sets family and weight independently.

**The arbitrary escape hatch is still open.** `font-[750]` emits
`font-weight: 750`, exactly as `p-[3px]` and `bg-[#fff]` do. That is the general
arbitrary-value hole, not specific to weight, and it belongs to the Phase 3
lint.

### Nothing may rely on the default instance

Commit Mono's `fvar` default is **200**, not 400, and its `OS/2.usWeightClass`
is 200. CSS still resolves an unstated `font-weight` to `normal`/400 rather than
to the font's default instance, so this is not the live bug it might look like —
but the margin for error is one missed declaration and the failure mode is
extra-light, not slightly-off. Every weight in the system is therefore stated:
`body` sets `--font-weight-body`, the heading/`strong` rule sets
`--font-weight-strong`, and `.field-label` sets `--font-weight-typed`. Record
fields on the token sheet carry `font-typed` alongside `font-record`.

`font-synthesis: none` on `body` remains correct and is now also unnecessary:
both faces carry real weight axes across the declared ranges, so there is
nothing left to synthesize.

**Ligatures.** This build carries no `liga`, `clig`, `dlig` or `calt` feature at
all — GSUB holds only `cv01–cv11` and `ss01–ss05`, which the subset drops. `!=`
cannot silently render as `≠`. `font-variant-ligatures: none` is kept on
`.field-label` anyway: it costs one line and it is the declaration that has to
survive a future font swap.

### The spacing allowlist — decided

Spacing tokens are legal on **padding, margin, gap and `space-*`. Nothing
else.** Size, `max-w-*`, inset, translate, scroll and indent are off-list even
though they take a length and read plausibly. `max-w-section: 6rem` is the case
that proves the rule: container width and track sizing were already settled as
explicitly not-spacing, and this is the same boundary.

This is the allowlist the Phase 3 lint enforces. It is a list of **legal (family
× token) pairs**, not a list of unknown names to flag — the utilities that will
actually bite are known to Tailwind and wrong for this project, so an
unknown-class check passes every one of them.

**Legal families.** Each combines with any of the six spacing tokens (`hair`,
`pair`, `field`, `entry`, `register`, `section`):

```
padding    p   px  py  pt  pr  pb  pl  ps  pe
margin     m   mx  my  mt  mr  mb  ml  ms  me
gap        gap gap-x   gap-y
space      space-x     space-y
```

Negative margins (`-mt-entry`, `-mx-register`) resolve and are legal — they are
the margin family.

**Everything else is a violation**, including every family in the Phase 0.2
inventory that is not listed above:

```
leading    leading-hair  leading-field  leading-entry  leading-section
size       w  min-w  max-w  h  min-h  max-h  size  basis
position   inset  inset-x  inset-y  top  right  bottom  left  start  end
transform  translate  translate-x  translate-y  translate-z
scroll     scroll-m  scroll-mt  scroll-p  scroll-pt
misc       indent  border-spacing
```

The four `leading-*` entries are the category error documented above; the rest
are valid CSS built from a token that was never designed for the job.

Nothing was fixed in code — per the brief, the decision is the deliverable, and
no off-list utility is in use today.

---

## Settled, and not open

- Cool gray-green ground. **Never** warm cream near `#F4F1EA`.
- **Never** a terracotta or burnt-orange accent near `#D97757`.
- No gradients. No box-shadows. Depth is the `card`-on-`board` value step.
- `stamp` is accession numbers, live data, and focus rings. Four uses per page, maximum.
- No sans-serif anywhere. Two faces, assigned by rule.
- Mono on fields, serif on prose. The split is not negotiable per-component.
- Accession numbers are never reused and never renumbered. The build enforces it.
- Never "collection," "curated," "showcase," "portfolio," or "journey."
- Structural devices encode information or they do not ship.
