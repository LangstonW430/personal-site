// The résumé, as source. Compiled to public/resume.pdf by scripts/build-resume.mjs
// (`npm run build:resume`), which is run by hand and the output committed — the
// same convention as build-favicon.mjs, and for the same reason: an artifact
// that regenerates on deploy can change without a commit saying so.
//
// The layout reproduces the LibreOffice original this file replaced (committed
// through 5db1d06): Carlito throughout, one page, US Letter, name and contact
// centered, ruled section heads, bold/italic two-column entry rows. Content is
// carried over verbatim except that the freelance entry no longer states a
// client count, so finishing a new project does not stale-date the document.
//
// The client-count rule, for future edits: EXTENT-style numbers that only grow
// (clients served, sites shipped) don't belong here — they expire. Numbers that
// are facts about a finished thing (a 29-file test suite, a 15% improvement)
// stay.

#set document(title: "Langston Woods — Résumé", author: "Langston Woods")
#set page(paper: "us-letter", margin: (x: 0.4in, top: 0.35in, bottom: 0.4in))
#set text(font: "Carlito", size: 11pt)
#set par(leading: 0.55em)
#set block(spacing: 0.55em)

#show link: it => underline(text(fill: rgb("#0563C1"), it))

// The original's bullets came from a fallback face (Carlito has no U+25CF, so
// Writer borrowed Liberation Serif's). A drawn circle sidesteps fallback
// entirely and keeps the build reproducible from the four committed fonts.
#set list(
  indent: 14pt,
  body-indent: 10pt,
  spacing: 0.55em,
  marker: box(baseline: 35%, circle(fill: black, radius: 1.9pt)),
)

// Section head: bold title over a full-width hairline, LibreOffice-style.
#let section(title) = {
  block(above: 12pt, below: 7pt)[
    #text(weight: "bold", size: 12pt)[#title]
    #v(3pt, weak: true)
    #line(length: 100%, stroke: 0.7pt)
  ]
}

// A two-column entry row: left-aligned and right-aligned halves on one line.
#let row(lhs, rhs) = grid(
  columns: (1fr, auto),
  column-gutter: 8pt,
  lhs, align(right + top, rhs),
)

// An entry head: bold org/title row over its italic detail row, kept tight;
// the `above` gap is what separates one entry from the bullets before it.
#let entry(hl, hr, sl, sr) = block(above: 9pt, below: 5pt)[
  #row(hl, hr)
  #v(2.5pt, weak: true)
  #row(sl, sr)
]

// A project head: one bold row, no italic sub-row, same entry separation.
#let phead(lhs, rhs) = block(above: 9pt, below: 5pt, row(lhs, rhs))

#align(center)[
  #text(size: 20.5pt, weight: "bold")[Langston Woods]
  #v(4pt, weak: true)
  585-626-8038 |
  #link("mailto:langstonw430@gmail.com")[langstonw430\@gmail.com] |
  #link("https://www.linkedin.com/in/langston-woods-16b7682b4")[LinkedIn] |
  #link("https://github.com/LangstonW430")[GitHub] |
  #link("https://langstonwoods.com/")[Website]
]

#section[Education]

#entry[*University of Rochester*][*Rochester, NY*][_B.S. Computer Science, AI Concentration; Math Minor_][_Aug. 2025 – May 2029_]
- Relevant Coursework: Data Structures and Algorithms, Discrete Mathematics, Linear Algebra and Differential Equations
- Planned Clusters: Computational Linguistics, Ethics of Technology
- Current GPA: 3.6

#section[Experience]

#entry[*Langston Woods Software Services (Freelance)*][*Remote*][_Founder / Web Developer | Astro, Netlify, Sveltia CMS_][_Apr. 2026 – Present_]
- Founded and operate a freelance web development business, designing and shipping production websites for small-business clients using Astro as the primary framework
- Deploy and maintain client sites on Netlify with Sveltia CMS for client-managed content, owning the full project lifecycle from scoping through launch and post-launch support

#entry[*Academic Intervention Specialist*][*June 2022 – Present*][_Vertus High School_][_Rochester, NY_]
- Provide one-on-one and small-group support in math and science to 25+ high school students per summer session, resulting in an average grade improvement of 15%
- Collaborate with 10+ teachers to reinforce classroom instruction and develop individualized learning strategies for at-risk students, improving student engagement by 40%
- Monitor student progress through weekly assessments, with 80% of students reaching grade-level proficiency and 87% of surveyed educators reporting significant academic improvement

#entry[*Marketing and AI Intern*][*June 2026 – Aug. 2026*][_Thomas Media Group_][_Rochester, NY_]
- Design, test, and implement AI-powered workflow automations using n8n and the Google Cloud SDK to improve operational efficiency across internal business processes
- Support and optimize internal technology infrastructure spanning CRM, project management, design, and AI platforms, including HubSpot, Asana, Figma, Claude, and ChatGPT
- Collaborate with cross-functional teams to identify process bottlenecks and evaluate technical solutions, contributing technical documentation and process guides to support adoption

#section[Projects]

#phead[*PromptDesk | TypeScript, Next.js, React, PostgreSQL (Prisma/Supabase), Stripe*][*Jun. – Aug. 2026*]
- Built a full-stack, multi-tenant CRM for freelancers with owner-scoped data isolation enforced at the query layer, validated by a 29-file, \~4,600-line test suite covering business logic, database ownership rules, and Stripe webhook signature verification
- Designed a dependency-free prompt-generation pipeline that deduplicates CRM records via Jaccard similarity, scores them with a weighted composite of recency decay, deal value, and objective relevance, and greedily allocates results against a token budget
- Integrated a read-only Stripe sync (webhooks + restricted API keys, AES-256-GCM encrypted credential storage) with idempotent charge processing keyed on payment-intent ID to prevent double-counted revenue

#phead[*CollabDocs | TypeScript, Next.js, Convex, TipTap, Tailwind CSS*][*Apr. 2026*]
- Built a shared document editor on Convex reactive queries, so a save on one client lands in every other open editor without a socket layer of its own
- Extended TipTap with a custom image node uploading to Convex storage, a Chart.js chart node, and a CommentMark anchoring comment threads to a text span with the quoted excerpt
- Implemented per-document sharing with editor and viewer roles and an email invite flow, with zod-validated mutations, an indexed audit log, and Vitest and Playwright suites

#section[Technical Skills]

*Languages:* Python, Java, TypeScript, JavaScript, HTML/CSS, SQL \
*Frameworks & Libraries:* React, Next.js, Astro, React Router, Prisma \
*Databases & Tools:* PostgreSQL, Supabase, Git, GitHub, VS Code, Vercel, Netlify, Stripe, Vitest, n8n, Google Cloud SDK
