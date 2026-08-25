#!/usr/bin/env node
/*
 * Compiles scripts/resume/resume.typ to public/resume.pdf.
 *
 * Run by hand — `npm run build:resume` — not at build time, and the PDF is
 * committed. Same convention and same reasoning as build-favicon.mjs.
 *
 * Fonts are loaded only from scripts/resume/fonts (the committed Carlito
 * family); system fonts are excluded so the output does not depend on what
 * the machine running the build happens to have installed.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const compiler = NodeCompiler.create({
	workspace: join(ROOT, 'scripts/resume'),
	fontArgs: [{ fontPaths: [join(ROOT, 'scripts/resume/fonts')] }],
});

const pdf = compiler.pdf({ mainFilePath: join(ROOT, 'scripts/resume/resume.typ') });
if (!pdf) throw new Error('build-resume: compilation produced no output');

const out = join(ROOT, 'public/resume.pdf');
writeFileSync(out, pdf);
console.log(`  public/resume.pdf  ${(pdf.length / 1024).toFixed(1)} kB`);
