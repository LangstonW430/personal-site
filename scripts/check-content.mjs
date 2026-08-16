#!/usr/bin/env node
// Lists every file still carrying the [[UNWRITTEN]] sentinel — content
// records and page-level placeholder prose (colophon, contact) alike — and
// exits non-zero if any remain. Deliberately not wired into `npm run build`:
// the site needs to deploy and be looked at while parts are still
// placeholder. It becomes a build gate at the end of Phase 1 (see
// design-directions.md).

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SEARCH_DIRS = ['src/content/records', 'src/pages'];
const EXTENSIONS = ['.mdx', '.astro'];
const SENTINEL = '[[UNWRITTEN]]';

function* walk(dir) {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) {
			yield* walk(path);
		} else if (EXTENSIONS.some((ext) => path.endsWith(ext))) {
			yield path;
		}
	}
}

const flagged = SEARCH_DIRS.flatMap((dir) => [...walk(join(ROOT, dir))])
	.filter((path) => readFileSync(path, 'utf8').includes(SENTINEL))
	.map((path) => relative(ROOT, path))
	.sort();

if (flagged.length > 0) {
	console.log(`${flagged.length} file(s) still contain ${SENTINEL}:\n`);
	for (const path of flagged) console.log(`  ${path}`);
	process.exit(1);
} else {
	console.log(`No ${SENTINEL} sentinels found.`);
}
