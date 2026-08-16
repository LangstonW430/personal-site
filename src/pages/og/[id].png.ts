/*
 * One OG image per record, generated at build time — `output: 'static'`
 * prerenders every route including this one, so nothing renders an image at
 * request time. Uses the real palette and the real faces: Satori can't read
 * the shipped WOFF2s (it supports TTF/OTF/WOFF only), so the two weights
 * this card needs — Commit Mono 450, Source Serif 4 600 — are static TTF
 * instances derived once from the self-hosted variable fonts and committed
 * under scripts/og-fonts/. How they were built is documented there.
 *
 * New build-time-only dependencies: satori (layout → SVG) and
 * @resvg/resvg-js (SVG → PNG). Neither ships to the browser.
 */
import { readFileSync } from 'node:fs';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { formatExtent } from '../../lib/format';

export async function getStaticPaths() {
	const records = await getCollection('records');
	return records.map((record) => ({ params: { id: record.id }, props: { record } }));
}

const COMMIT_MONO = readFileSync(new URL('../../../scripts/og-fonts/CommitMono-450.ttf', import.meta.url));
const SOURCE_SERIF = readFileSync(new URL('../../../scripts/og-fonts/SourceSerif4-600.ttf', import.meta.url));

const COLOR = {
	board: '#E4E5E0',
	card: '#F7F7F4',
	ink: '#22241F',
	inkMuted: '#6B6E66',
	rule: '#C9CBC3',
	stamp: '#6E4B7E',
};

const MONO = 'Commit Mono';
const SERIF = 'Source Serif 4';

export const GET: APIRoute = async ({ props }) => {
	const record = props.record as Awaited<ReturnType<typeof getCollection<'records'>>>[number];
	const { acc, title, medium, status } = record.data;
	const extent = formatExtent(record.data.extent);

	const tree = {
		type: 'div',
		props: {
			style: {
				width: '1200px',
				height: '630px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				backgroundColor: COLOR.board,
				padding: '72px',
			},
			children: [
				// Header: the accession, exactly as it reads on a record page.
				{
					type: 'div',
					props: {
						style: { display: 'flex', flexDirection: 'column' },
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: MONO,
										fontSize: '22px',
										letterSpacing: '3px',
										textTransform: 'uppercase',
										color: COLOR.inkMuted,
									},
									children: 'Acc.',
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: MONO,
										fontSize: '40px',
										color: COLOR.stamp,
										marginTop: '6px',
									},
									children: acc,
								},
							},
						],
					},
				},

				// Title: the one piece of prose on the card.
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							fontFamily: SERIF,
							fontWeight: 600,
							fontSize: '58px',
							lineHeight: 1.2,
							color: COLOR.ink,
						},
						children: title,
					},
				},

				// Footer: medium left, extent/status right — a card panel,
				// same value step the rest of the site uses for depth.
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							backgroundColor: COLOR.card,
							border: `1px solid ${COLOR.rule}`,
							padding: '28px 32px',
							gap: '10px',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontFamily: MONO,
										fontSize: '22px',
										color: COLOR.ink,
									},
									children: medium.join(' · '),
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										justifyContent: 'space-between',
										fontFamily: MONO,
										fontSize: '20px',
										color: COLOR.inkMuted,
									},
									children: [
										{ type: 'div', props: { style: { display: 'flex' }, children: extent ?? '' } },
										{
											type: 'div',
											props: { style: { display: 'flex', color: COLOR.stamp }, children: status.toUpperCase() },
										},
									],
								},
							},
						],
					},
				},
			],
		},
	};

	const svg = await satori(tree as never, {
		width: 1200,
		height: 630,
		// `weight` here is a match label against a node's `fontWeight` style,
		// not a description of the font file — neither style object below sets
		// `fontWeight`, so this only has to be one of satori's nine enum
		// values. The glyphs are whatever the TTF actually is: 450 and 600,
		// baked in when the static instances were built (scripts/og-fonts/).
		fonts: [
			{ name: MONO, data: COMMIT_MONO, weight: 400, style: 'normal' },
			{ name: SERIF, data: SOURCE_SERIF, weight: 600, style: 'normal' },
		],
	});

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	const png = resvg.render().asPng();

	return new Response(new Uint8Array(png), {
		headers: { 'Content-Type': 'image/png' },
	});
};
