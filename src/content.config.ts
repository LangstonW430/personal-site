import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
// Zod comes from `astro/zod`, not the `z` re-export on `astro:content` (which
// Astro 7 deprecates) and not a direct `zod` dependency — this is the exact
// build Astro validates frontmatter with, so the schema and the validator
// cannot drift apart on a version bump.
import { z } from 'astro/zod';

/**
 * Accession numbers are `YYYY.NN`, assigned in order of entry, never reused and
 * never renumbered. A Zod schema can enforce the shape of one number but has no
 * way to see the others, so uniqueness is enforced here instead: the glob
 * loader runs, then the whole collection is swept for collisions before the
 * store is handed on.
 *
 * This throws rather than warns. A reused accession number is a silent lie
 * about the register's history — two records claiming the same position — and
 * it must not be possible to ship one by not reading the build log.
 */
function withUniqueAccession(loader: Loader): Loader {
	return {
		...loader,
		name: `${loader.name}+unique-accession`,
		load: async (context) => {
			await loader.load(context);

			const seen = new Map<string, string>();
			const collisions: string[] = [];

			for (const entry of context.store.values()) {
				const acc = (entry.data as { acc?: unknown }).acc;
				if (typeof acc !== 'string') continue;

				const prior = seen.get(acc);
				if (prior === undefined) {
					seen.set(acc, entry.id);
				} else {
					collisions.push(`  ${acc} — claimed by both "${prior}" and "${entry.id}"`);
				}
			}

			if (collisions.length > 0) {
				throw new Error(
					`Duplicate accession number${collisions.length > 1 ? 's' : ''} in the projects ` +
						`collection:\n${collisions.join('\n')}\n\n` +
						`Accession numbers are assigned in order of entry and are never reused. ` +
						`Give the newer record the next unclaimed number for its year.`,
				);
			}
		},
	};
}

const projects = defineCollection({
	loader: withUniqueAccession(
		glob({ base: './src/content/projects', pattern: '**/*.mdx' }),
	),
	schema: z
		.strictObject({
			// YYYY.NN — the fourth work entered in 2026 is 2026.04. Carries output
			// rate and history without any claim being made about the work.
			acc: z
				.string()
				.regex(/^\d{4}\.\d{2}$/, 'accession numbers are YYYY.NN, e.g. 2026.04'),

			title: z.string().min(1),
			summary: z.string().min(1),

			client: z.string().min(1).optional(),
			role: z.string().min(1),

			// MEDIUM, never "stack" or "tech". The field name is the theme.
			medium: z.array(z.string().min(1)).nonempty(),

			acquired: z.date(),
			completed: z.date().optional(),

			status: z.enum(['active', 'shipped', 'archived']),

			// Extent is measured: 4,180 LOC · 118 commits · 7 weeks. Every part is
			// optional because a record should state only what was actually counted
			// — a guessed number is worse than an absent one.
			extent: z
				.strictObject({
					loc: z.number().int().positive().optional(),
					commits: z.number().int().positive().optional(),
					duration: z.string().min(1).optional(),
				})
				.default({}),

			// Required, and deliberately so. Every record states its actual state:
			// "Stable. Deps current as of Jun 2026." / "Archived — don't run it."
			// This is the most differentiating field in the system and the one most
			// likely to be softened into uselessness.
			condition: z.string().min(1),

			locality: z.string().min(1).optional(),

			links: z
				.strictObject({
					live: z.url().optional(),
					source: z.url().optional(),
					// A writeup is usually a post on this site, so this one field also
					// accepts a root-relative path.
					writeup: z.union([z.url(), z.string().startsWith('/')]).optional(),
				})
				.default({}),

			featured: z.boolean().default(false),
			order: z.number().int(),
		})
		.refine((p) => p.status !== 'shipped' || p.completed !== undefined, {
			message: 'a record with status "shipped" needs a `completed` date',
			path: ['completed'],
		})
		.refine((p) => p.completed === undefined || p.completed >= p.acquired, {
			message: '`completed` cannot precede `acquired`',
			path: ['completed'],
		})
		.refine((p) => p.acc.slice(0, 4) === String(p.acquired.getUTCFullYear()), {
			message: 'the accession year must match the year in `acquired`',
			path: ['acc'],
		}),
});

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.mdx' }),
	schema: z.strictObject({
		title: z.string().min(1),
		slug: z
			.string()
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase kebab-case, no leading or trailing dash'),
		date: z.date(),
		description: z.string().min(1),
		tags: z.array(z.string().min(1)),
		// Defaults to true so a half-written post cannot ship by omission.
		// Publishing is an explicit act.
		draft: z.boolean().default(true),
	}),
});

export const collections = { projects, posts };
