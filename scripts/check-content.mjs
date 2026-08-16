#!/usr/bin/env node
// Lists every content file still carrying the [[UNWRITTEN]] sentinel and
// exits non-zero if any remain. Deliberately not wired into `npm run build`
// — Phase 2b needs to deploy and be looked at while everything is still
// placeholder. It becomes a build gate at the end of Phase 1 (see
// design-directions.md).

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT_DIR = join(ROOT, 'src/content/records');
const SENTINEL = '[[UNWRITTEN]]';

function* walk(dir) {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) {
			yield* walk(path);
		} else if (path.endsWith('.mdx')) {
			yield path;
		}
	}
}

const flagged = [...walk(CONTENT_DIR)]
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
