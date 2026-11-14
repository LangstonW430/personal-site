// The résumé, as source. Compiled to public/resume.pdf by scripts/build-resume.mjs
// (`npm run build:resume`), which is run by hand and the output committed — the
// same convention as build-favicon.mjs, and for the same reason: an artifact
// that regenerates on deploy can change without a commit saying so.
//
// The layout reproduces the LibreOffice original this file replaced (committed
// through 5db1d06): Carlito throughout, one page, US Letter, name and contact
// centered, ruled section heads, bold/italic two-column entry rows. The layout
// is the carried-over part; the content is not, and no longer claims to be. It
// now tracks the November 2026 revision, which added a Research section, ended
// the Vertus and Thomas Media roles, replaced CollabDocs with Gym Tracker, and
// re-dated PromptDesk.
//
// Body text is 10.4pt, down from the original's 11pt. The November revision
// adds a whole Research section and a third project while trimming only three
// bullets, and at 11pt the Technical Skills block no longer fits — it lands
// alone on a second page. 11pt was tried with the margins and the section and
// entry gaps tightened as far as they go and still overflowed, so the choice
// was type size or cut content, and nothing here was Claude's to cut. 10.4pt
// is the largest size that holds one page at the spacing above; 10.5pt does
// not. The uploaded November PDF is set smaller than 11pt for the same reason.
//
// This is the lever with the least slack in the file. The next entry added
// will not fit, and the answer then is to remove something — the Databases &
// Tools line is seventeen items and wraps to two, and Git and VS Code are not
// telling a recruiter anything — not to shave another half point.
//
// The client-count rule, for future edits: EXTENT-style numbers that only grow
// (clients served, sites shipped) don't belong here — they expire. Numbers that
// are facts about a finished thing (a 43-file test suite, an 87% survey result)
// stay. The November revision reintroduced a "5 production websites" count in
// the freelance entry; it is deliberately not reproduced below. The two named
// client sites are, because a name does not go stale the way a tally does.

#set document(title: "Langston Woods — Résumé", author: "Langston Woods")
#set page(paper: "us-letter", margin: (x: 0.4in, top: 0.35in, bottom: 0.4in))
#set text(font: "Carlito", size: 10.4pt)
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

#entry[*University of Rochester*][*Rochester, NY*][_B.S. Computer Science, AI Concentration; Mathematics Minor_][_Expected May 2029_]
- Relevant Coursework: Data Structures and Algorithms, Discrete Mathematics, Linear Algebra and Differential Equations; in progress: Computer Organization (CSC 252), Computation and Formal Systems (CSC 173)
- GPA: 3.6

#section[Research]

#entry[*Undergraduate Researcher, Hangfeng He's Group*][*Sept. 2026 – Present*][_University of Rochester_][_Rochester, NY_]
- Designed and ran a counterfactual audit for demographic bias in medical diagnosis: inserted race and gender cues into MedQA/DiversityMedQA exam questions and measured answer-flip rates and logprob-based confidence shifts across open-source LLMs (Gemma, Qwen) served with Ollama on UR's CIRC GPU cluster (Slurm)
- Building a systematic, LLM-driven method to surface hidden biases beyond race and gender, and using each model's bias patterns to characterize its behavioral profile

#section[Experience]

#entry[*Langston Woods Software Services (Freelance)*][*Remote*][_Founder / Web Developer | Astro, Netlify, Sveltia CMS_][_Apr. 2026 – Present_]
- Founded and operate a freelance web development business; designed and shipped production websites for small-business clients (e.g., dimetech.net, mariashairemporium.com) using Astro as the primary framework
- Deploy and maintain client sites on Netlify with Sveltia CMS for client-managed content, owning the full project lifecycle from scoping through launch and post-launch support

#entry[*Academic Intervention Specialist*][*June 2022 – Aug. 2026*][_Vertus High School_][_Rochester, NY_]
- Provided one-on-one and small-group math and science support to 25+ high school students per summer session
- Collaborated with 10+ teachers on individualized learning strategies for at-risk students; in a teacher survey, 87% of responding educators reported significant academic improvement

#entry[*Marketing and AI Intern*][*June 2026 – Aug. 2026*][_Thomas Media Group_][_Rochester, NY_]
- Built an n8n + Google Cloud SDK pipeline that turns a podcast episode dropped into Google Drive into a generated transcript and description, then publishes it to YouTube and podcast platforms
- Supported internal technology infrastructure spanning CRM, project management, and design platforms, including HubSpot, Asana, and Figma; contributed technical documentation and process guides to support adoption

#section[Projects]

#phead[*Gym Tracker + MCP Server | Next.js, TypeScript, Convex, Vercel, MCP, Langfuse*][*Oct. 2026 – Present*]
- Built a workout-tracking PWA with a Capacitor iOS shell on Next.js, Convex, and Vercel used for every workout (\~5 per week)
- Exposed it to Claude through a 13-tool remote MCP server (stateless Streamable HTTP; 8 read, 5 write, no deletes) for editing routines in conversation, authenticated with revocable 256-bit tokens stored only as SHA-256 hashes
- Traced every tool call with Langfuse/OpenTelemetry (args, results, errors, latency), exporting only tool spans and verifying the connector token never reaches production traces; backed by Vitest and convex-test suites

#phead[*PromptDesk | TypeScript, Next.js, React, PostgreSQL (Prisma/Supabase), Stripe*][*Jun. – Oct. 2026*]
- Built a full-stack, multi-tenant CRM for freelancers with owner-scoped data isolation enforced at the query layer, validated by a 43-file, \~7,000-line test suite covering business logic, database ownership rules, and Stripe webhook signature verification
- Designed a dependency-free prompt-generation pipeline that deduplicates CRM records via Jaccard similarity, scores them with a weighted composite of recency decay, deal value, and objective relevance, and greedily allocates results against a token budget
- Integrated a read-only Stripe sync (webhooks + restricted API keys, AES-256-GCM encrypted credential storage) with idempotent charge processing keyed on payment-intent ID to prevent double-counted revenue

#section[Technical Skills]

*Languages:* Python, Java, TypeScript, JavaScript, HTML/CSS \
*Frameworks & Libraries:* React, Next.js, Astro, React Router, Prisma \
*Databases & Tools:* PostgreSQL, Supabase, Convex, Git, GitHub, VS Code, Vercel, Netlify, Stripe, Vitest, n8n, Google Cloud SDK, MCP, Langfuse, OpenTelemetry, Ollama, Slurm
