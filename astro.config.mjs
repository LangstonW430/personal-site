// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

/**
 * Bridges `.env` files into `process.env` so local development can hold a
 * GITHUB_TOKEN the same way Vercel does.
 *
 * Astro loads `.env` into `import.meta.env`, not `process.env` — and this
 * project reads secrets from `process.env` deliberately (see the note in
 * src/pages/index.astro: Vite statically inlines `import.meta.env.X`, which
 * once baked a token's literal value into a deployed function bundle). The
 * two facts together mean a `.env` file would otherwise be silently ignored
 * by the one piece of code that wants it. This closes that gap without
 * touching the rule that produced it.
 *
 * `loadEnv` is Vite's own dotenv reader — already present as an Astro
 * dependency, so no new package — and it covers `.env`, `.env.local`, and the
 * mode-specific variants. The `''` prefix argument is what makes it return
 * unprefixed keys; Vite's default would only hand back `VITE_*`.
 *
 * `??=`, never `=`: a real environment variable always wins. On Vercel the
 * platform has already populated `process.env`, so every assignment here
 * no-ops and production behaviour is unchanged. Nothing reaches the browser
 * either — this mutates the build/dev process only, and the client bundle
 * still has no `import.meta.env` reference to inline.
 */
for (const [key, value] of Object.entries(loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), ''))) {
	process.env[key] ??= value;
}

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

/**
 * Fails the build when a PDF linked from the site (the résumé) is not in
 * `public/`.
 *
 * Same shape as `fontGuard`, and for the same reason: a missing file here has
 * no error state of its own. The link still renders, still looks clickable,
 * and quietly 404s — the single worst broken link on this site, because it's
 * the one a recruiter hits at exactly the moment they decided to act, and the
 * one nobody browsing the register would ever stumble onto to notice is dead.
 *
 * Parameterised by file rather than hardcoded, so a second linked document
 * would be another call rather than another function.
 *
 * @param {{ file: string, label: string }} options
 * @returns {import('astro').AstroIntegration}
 */
function linkedFileGuard({ file, label }) {
	/** @type {import('astro').AstroConfig | undefined} */
	let resolved;

	/** @param {import('astro').AstroConfig} config */
	const isMissing = (config) => !existsSync(join(fileURLToPath(config.publicDir), file));

	const report = () =>
		`linked-file-guard: public/${file} is missing. It's linked from / and /contact/ — a ` +
		`missing ${label} does not error at runtime, the link just renders and 404s. Add the ` +
		`file, or update the path in astro.config.mjs's linkedFileGuard call and in both ` +
		`src/pages/index.astro and src/pages/contact/index.astro (these are not linked by ` +
		`import, only by convention, the same way global.css's @font-face paths and ` +
		`font-guard agree).`;

	return {
		name: `linked-file-guard:${file}`,
		hooks: {
			'astro:config:done': ({ config }) => {
				resolved = config;
			},
			'astro:build:start': () => {
				if (resolved && isMissing(resolved)) throw new Error(report());
			},
			'astro:server:start': ({ logger }) => {
				if (resolved && isMissing(resolved)) logger.warn(report());
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://personal-site-sigma-bay.vercel.app',

	// Static by default. Every route prerenders except the register (`/`),
	// which opts into on-demand rendering itself via `export const prerender
	// = false` — the Vercel adapter below is what makes that legal. That one
	// route renders the GitHub instrument panel server-side per request
	// (cached at the edge for 5 minutes via a Cache-Control header, not via
	// Astro's server islands — see src/pages/index.astro for why: server
	// islands inject a client-side fetch to swap themselves in, which fails
	// zero-client-JS, the more load-bearing constraint of the two).
	output: 'static',
	adapter: vercel(),

	integrations: [
		mdx(),
		fontGuard(),
		linkedFileGuard({ file: 'resume.pdf', label: 'résumé' }),
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
