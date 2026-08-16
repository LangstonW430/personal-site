// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

/**
 * Fails the build when an `@font-face` rule points at a file that is not in
 * `public/fonts/`.
 *
 * Same family as the accession guards in src/content.config.ts, and for the
 * same reason: a missing font is the failure mode most likely to ship without
 * anyone noticing. CSS has no error state for it — the browser silently falls
 * back to `ui-monospace` or `Georgia`, the page still renders, nothing appears
 * in a console anyone reads, and the site is simply set in the wrong face until
 * someone happens to look closely. There is no sans-serif in this system and
 * Commit Mono carries every record field, so "silently the wrong face" is a
 * substantial fraction of the design.
 *
 * Throws at `astro:build:start` and only warns at `astro:server:start`. Nothing
 * can be deployed with a missing font, but dev still runs — you may be halfway
 * through writing a record and not in a position to go and download a typeface.
 * The throw is deliberately not at `astro:config:done`: that hook also runs for
 * `astro check`, which would make a missing font indistinguishable from a type
 * error and cost that command its meaning.
 *
 * @param {{ stylesheet?: string }} [options]
 * @returns {import('astro').AstroIntegration}
 */
function fontGuard({ stylesheet = 'src/styles/global.css' } = {}) {
	/** Captured at `astro:config:done`; the later hooks are not given the config.
	 * @type {import('astro').AstroConfig | undefined} */
	let resolved;

	/**
	 * @param {import('astro').AstroConfig} config
	 * @returns {string[]} one line per unresolved @font-face reference
	 */
	const findMissing = (config) => {
		const root = fileURLToPath(config.root);
		const publicDir = fileURLToPath(config.publicDir);
		const stylesheetPath = join(root, stylesheet);

		if (!existsSync(stylesheetPath)) {
			throw new Error(
				`font-guard: cannot read ${stylesheet}. The guard is configured against a ` +
					`stylesheet that does not exist — correct the path in astro.config.mjs.`,
			);
		}

		const css = readFileSync(stylesheetPath, 'utf8');
		const missing = [];

		for (const [, block] of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
			const family = block.match(/font-family:\s*["']?([^"';]+)["']?\s*;/)?.[1]?.trim();

			for (const [, reference] of block.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
				// Only local, root-relative references are ours to check. An absolute
				// URL would be a third-party request, which this project does not
				// make — that is enforced by review, not here.
				if (!reference.startsWith('/')) continue;

				if (!existsSync(join(publicDir, reference))) {
					missing.push(`  ${family ?? 'unknown family'} — public${reference}`);
				}
			}
		}

		return missing;
	};

	/** @param {string[]} missing */
	const report = (missing) =>
		`Missing font file${missing.length > 1 ? 's' : ''} referenced by @font-face in ` +
		`${stylesheet}:\n${missing.join('\n')}\n\n` +
		`A missing font does not error at runtime — the browser falls back and the ` +
		`page renders in the wrong face. Add the file, or remove the @font-face ` +
		`rule that references it. Do not substitute a different face.`;

	return {
		name: 'font-guard',
		hooks: {
			'astro:config:done': ({ config }) => {
				resolved = config;
			},
			'astro:build:start': () => {
				const missing = resolved ? findMissing(resolved) : [];
				if (missing.length > 0) throw new Error(report(missing));
			},
			'astro:server:start': ({ logger }) => {
				const missing = resolved ? findMissing(resolved) : [];
				if (missing.length > 0) logger.warn(report(missing));
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://personal-site-sigma-bay.vercel.app',

	// Static by default. The Vercel adapter is wired now only so the Phase 4
	// GitHub instrument panel can become a server island without a config
	// change. Nothing renders on demand today; every route is prerendered.
	output: 'static',
	adapter: vercel(),

	integrations: [
		mdx(),
		fontGuard(),
		// Excludes /og/*.png — those are build artifacts (the OG image
		// endpoint), not pages, and don't belong in a page sitemap.
		sitemap({
			filter: (page) => !page.includes('/og/'),
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},

	build: {
		// One stylesheet as a <link>, not inlined per page. Tailwind's output is
		// a single file shared across every route; inlining would duplicate the
		// whole theme into each document.
		inlineStylesheets: 'never',
	},

	prefetch: false,
});
