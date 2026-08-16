/*
 * RSS for accruals only — records are the catalogue itself and don't
 * "publish" in a feed sense, accruals are the notes filed against them over
 * time. `draft: true` (the schema default) means not published yet, so a
 * draft accrual is excluded here the same way `draft` gates anything else:
 * every accrual in the register today is still a Phase 2b placeholder, so
 * this feed is currently empty — a valid feed with zero items, not missing.
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
	const [records, articles] = await Promise.all([getCollection('records'), getCollection('articles')]);
	const recordByAcc = new Map(records.map((record) => [record.data.acc, record]));

	const items = articles
		.filter((article) => !article.data.draft)
		.map((article) => {
			const record = recordByAcc.get(article.data.record);
			if (!record) return null;
			const slug = article.id.slice(article.id.indexOf('/') + 1);
			return {
				title: `${record.data.acc}, note ${article.data.note} — ${article.data.title}`,
				description: article.data.summary,
				pubDate: article.data.filed,
				link: `/${record.id}/${slug}/`,
			};
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)
		.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

	return rss({
		title: 'Langston — accruals',
		description: 'Notes filed against records in the register, most recent first.',
		site: context.site ?? 'https://personal-site-sigma-bay.vercel.app',
		items,
	});
}
