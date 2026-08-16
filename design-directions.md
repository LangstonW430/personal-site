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

## Findings from Phase 0

Recorded here because they constrain Phase 2 and were discovered by testing, not
by reading docs.

**The `@theme` wipe works, but it does not error.** `--color-*: initial` and the
other four wipes make `bg-slate-800`, `text-red-500`, `p-4`, `gap-2`,
`rounded-lg`, `font-sans`, and `text-3xl` produce **zero CSS output**. The build
does *not* fail — Tailwind silently emits nothing. So the wipe removes the
convenience but not the footgun: a typo like `text-ink-mute` also silently
produces nothing and ships as unstyled. Worth a lint rule in Phase 3.

**Five namespaces are not covered by the wipe.** `--shadow-*`, `--blur-*`,
`--animate-*`, `--tracking-*`, and `--leading-*` are not in the `@theme` block,
so `shadow-lg`, `blur-sm`, `animate-spin`, `tracking-wide`, and `leading-tight`
all remain reachable. `shadow-lg` being available matters: CLAUDE.md forbids
box-shadows everywhere, and right now nothing mechanically prevents one. Adding
`--shadow-*: initial` would close it. Not done in Phase 0 because the brief said
to follow the block exactly.

**There is no spacing scale.** `--spacing-*: initial` removed it and nothing
replaced it, so `p-4`, `gap-2`, `mt-8` and every other spacing utility resolve to
nothing. Only arbitrary values (`p-[1.5rem]`) work, which is what the token test
sheet uses throughout. **Phase 2 cannot lay anything out until this is decided.**
The options are to declare a named-by-intent spacing scale in `@theme`, or to
commit to arbitrary values everywhere as a deliberate anti-uniformity measure.
This is a real decision and it belongs to whoever starts Phase 2, not to Phase 0.

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
