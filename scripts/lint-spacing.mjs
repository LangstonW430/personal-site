#!/usr/bin/env node
// The spacing allowlist from design-directions.md, enforced. Six tokens —
// hair, pair, field, entry, register, section — are legal on padding,
// margin, gap, and space-* only. Tailwind's `--spacing-*` fallback also
// generates plausible-looking utilities in families that were never meant to
// carry them (leading-hair, max-w-section, w-field, ...), and those don't
// error — they just resolve to the wrong CSS silently.
//
// This is a list of *known-and-wrong* (family × token) pairs, not an
// unknown-class check: a utility this script has never heard of (flex,
// text-sm, border-rule) is not its business and is never flagged. Only the
// specific families design-directions.md's Phase 0.2 inventory identified as
// spacing-token-reachable-but-wrong are checked.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SEARCH_DIRS = ['src'];
const EXTENSIONS = new Set(['.astro', '.ts', '.tsx', '.mdx']);

const TOKENS = ['hair', 'pair', 'field', 'entry', 'register', 'section'];

// Every family in the Phase 0.2 "off-list" inventory. `leading` is narrower
// than the rest on purpose — `leading-pair` and `leading-register` don't
// exist as reachable utilities at all (the two tokens were named specifically
// to dodge that collision), so only the four that do resolve are listed.
const WRONG_FAMILIES = [
	'w',
	'min-w',
	'max-w',
	'h',
	'min-h',
	'max-h',
	'size',
	'basis',
	'inset',
	'inset-x',
	'inset-y',
	'top',
	'right',
	'bottom',
	'left',
	'start',
	'end',
	'translate',
	'translate-x',
	'translate-y',
	'translate-z',
	'scroll-m',
	'scroll-mt',
	'scroll-p',
	'scroll-pt',
	'indent',
	'border-spacing',
];
const LEADING_TOKENS = ['hair', 'field', 'entry', 'section'];

const KNOWN_WRONG = new Set([
	...LEADING_TOKENS.map((t) => `leading-${t}`),
	...WRONG_FAMILIES.flatMap((family) => TOKENS.map((t) => `${family}-${t}`)),
]);

function* walk(dir) {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) {
			yield* walk(path);
		} else if (EXTENSIONS.has(extname(path))) {
			yield path;
		}
	}
}

// A class token is word characters and hyphens, optionally preceded by a
// variant prefix (md:, hover:, etc.) that this check doesn't care about.
const TOKEN_PATTERN = /[a-zA-Z0-9_-]+/g;

const findings = [];

for (const dir of SEARCH_DIRS) {
	for (const path of walk(join(ROOT, dir))) {
		const text = readFileSync(path, 'utf8');
		const lines = text.split('\n');
		lines.forEach((line, i) => {
			const seen = new Set();
			for (const match of line.matchAll(TOKEN_PATTERN)) {
				const raw = match[0];
				const utility = raw.includes(':') ? raw.slice(raw.lastIndexOf(':') + 1) : raw;
				if (KNOWN_WRONG.has(utility) && !seen.has(utility)) {
					seen.add(utility);
					findings.push({ path: relative(ROOT, path), line: i + 1, utility });
				}
			}
		});
	}
}

if (findings.length > 0) {
	console.log(`${findings.length} known-and-wrong spacing utility use(s):\n`);
	for (const { path, line, utility } of findings) {
		console.log(`  ${path}:${line}  ${utility}`);
	}
	process.exit(1);
} else {
	console.log(`No known-and-wrong spacing utilities found (checked ${KNOWN_WRONG.size} family×token pairs).`);
}
