// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://personal-site.vercel.app',

	// Static by default. The Vercel adapter is wired now only so the Phase 4
	// GitHub instrument panel can become a server island without a config
	// change. Nothing renders on demand today; every route is prerendered.
	output: 'static',
	adapter: vercel(),

	integrations: [mdx()],

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
