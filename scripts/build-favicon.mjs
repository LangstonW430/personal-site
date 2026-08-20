#!/usr/bin/env node
/*
 * Generates the site's favicon set from the real palette and the real face.
 *
 * Run by hand — `npm run build:favicon` — not at build time. The output is
 * committed, the same way lib/map-geometry.json is on 2026.07: a mark that
 * regenerates on every deploy is a mark that can silently change without a
 * commit saying so.
 *
 * "LW" is set in Commit Mono, because every identifier on this site is. The
 * mark is the accession-label voice applied to the person, not a logo.
 *
 * Satori is what makes this honest: it converts the glyphs to <path> data, so
 * the SVG carries the real letterforms and does not depend on the reader
 * having Commit Mono installed. A <text> element with font-family would fall
 * back to whatever monospace the OS has, which for a site with no sans-serif
 * anywhere would be the one place the type system leaks.
 *
 * ICO is assembled here rather than with a converter dependency. The format is
 * a 6-byte header, one 16-byte directory entry per image, then the images —
 * and since Vista, those images may be PNGs stored whole, so the PNGs resvg
 * already produced can be embedded without a BMP encoder.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ROOT = process.cwd();
const OUT = join(ROOT, 'public');
const COMMIT_MONO = readFileSync(join(ROOT, 'scripts/og-fonts/CommitMono-450.ttf'));

// Straight from @theme in src/styles/global.css. Duplicated deliberately —
// this script runs outside the Vite pipeline and cannot import the CSS, so
// the values are restated and must be checked against it by eye if they ever
// move. There are only two.
const CARD = '#F7F7F4';
const STAMP = '#6E4B7E';

/** The canvas Satori lays out in. Rendered once, downsampled by resvg. */
const SIZE = 512;

/**
 * Optical sizing, not arithmetic. "LW" is two full-width Commit Mono cells;
 * at this fraction the pair very nearly fills the square, which is what keeps
 * it legible when a browser draws it at 16px. A comfortable-looking margin at
 * 512px becomes an illegible smudge at 16.
 */
const FONT_SIZE = Math.round(SIZE * 0.72);

/**
 * Centring is done by measuring, not by nudging.
 *
 * Flex centring aligns the text's *layout box*, and for this pair that box is
 * wrong twice over: a monospace cell is wider than the ink of an L, and the
 * line box is taller than cap height. Centring it leaves the mark visibly
 * high and right — which is exactly what the first attempt did.
 *
 * So: render once, read the true ink bounds out of the path data Satori
 * emitted, and translate by the difference. The mark ends up optically
 * centred no matter what the font's metrics say.
 */
function inkBounds(svg) {
	const path = svg.match(/<path fill="[^"]*" d="([^"]+)"/)?.[1];
	if (!path) throw new Error('build-favicon: no glyph path in Satori output — font failed to load?');

	const numbers = path.match(/-?\d+(\.\d+)?/g).map(Number);
	const xs = [];
	const ys = [];
	for (let i = 0; i + 1 < numbers.length; i += 2) {
		xs.push(numbers[i]);
		ys.push(numbers[i + 1]);
	}
	return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function centre(svg) {
	const { minX, maxX, minY, maxY } = inkBounds(svg);
	const dx = (SIZE - (maxX - minX)) / 2 - minX;
	const dy = (SIZE - (maxY - minY)) / 2 - minY;
	return svg.replace(/<g {2}>/, `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})">`);
}

async function markSvg({ background, foreground }) {
	const raw = await rawMark({ background, foreground });
	return centre(raw);
}

async function rawMark({ background, foreground }) {
	return satori(
		{
			type: 'div',
			props: {
				style: {
					width: `${SIZE}px`,
					height: `${SIZE}px`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: background,
				},
				children: {
					type: 'div',
					props: {
						style: {
							fontFamily: 'Commit Mono',
							fontSize: `${FONT_SIZE}px`,
							color: foreground,
						},
						children: 'LW',
					},
				},
			},
		},
		{
			width: SIZE,
			height: SIZE,
			fonts: [{ name: 'Commit Mono', data: COMMIT_MONO, weight: 450, style: 'normal' }],
		},
	);
}

const png = (svg, size) =>
	new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();

/**
 * ICO container. `sizes` are rendered from the SVG and stored as PNGs.
 * A dimension of 256 or more is written as 0 in the directory, per the spec's
 * one-byte field — not reachable here, but the encoder should not be quietly
 * wrong if someone adds 256 to the list.
 */
function ico(svg, sizes) {
	const images = sizes.map((size) => ({ size, data: png(svg, size) }));

	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: 1 = icon
	header.writeUInt16LE(images.length, 4);

	let offset = 6 + images.length * 16;
	const entries = [];

	for (const { size, data } of images) {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
		entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
		entry.writeUInt8(0, 2); // palette count: 0 = truecolour
		entry.writeUInt8(0, 3); // reserved
		entry.writeUInt16LE(1, 4); // colour planes
		entry.writeUInt16LE(32, 6); // bits per pixel
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		entries.push(entry);
		offset += data.length;
	}

	return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const write = (name, data) => {
	writeFileSync(join(OUT, name), data);
	const kb = (data.length / 1024).toFixed(1);
	console.log(`  public/${name}  ${kb} kB`);
};

mkdirSync(OUT, { recursive: true });

/*
 * `--inverse` swaps the ground for the ink: a stamp tile with card letters.
 *
 * The default is card ground, which is the site's own logic — the mark reads
 * as ink on a record rather than as a coloured badge, and `stamp` stays the
 * scarcest ink on the site instead of being spent on its most-repeated
 * element. The tradeoff, checked at 16px against light browser chrome rather
 * than assumed: the off-white tile does blend into the tab strip, and it is
 * the letterforms that carry the mark. The inverse defines its own edge and
 * is the one to switch to if that ever reads as weak.
 *
 * Only one set is ever written. An unlinked alternate sitting in public/ is a
 * file that deploys, is fetched by nothing, and drifts out of date silently.
 */
const inverse = process.argv.includes('--inverse');
const mark = await markSvg({
	background: inverse ? STAMP : CARD,
	foreground: inverse ? CARD : STAMP,
});

console.log(inverse ? 'Inverse — stamp ground, card letters:' : 'Card ground, stamp letters:');
write('favicon.svg', mark);
// Three sizes in one container: 16 for the tab, 32 for the address bar and
// bookmarks, 48 for Windows' larger shortcut views.
write('favicon.ico', ico(mark, [16, 32, 48]));
// iOS home-screen. No 192/512 and no web manifest: nothing on this site is
// installable, and icons nothing references are dead weight in public/.
write('apple-touch-icon.png', png(mark, 180));
