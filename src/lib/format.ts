// Shared field formatting for record and accrual pages. Kept in one place so
// the register, a record, and its accruals never disagree on how a date or
// an extent is written.

/** ISO date, e.g. "2026-06-14" — the format a record is dated in. */
export const formatDate = (d: Date): string => d.toISOString().slice(0, 10);

/**
 * Date to the minute, e.g. "2026-08-18 18:12 UTC". Explicitly UTC and
 * explicitly labelled: this renders on a server whose timezone is Vercel's,
 * not the reader's, so an unlabelled "18:12" would be a different real moment
 * depending on where the page was built. Naming the zone costs four
 * characters and makes the figure checkable against GitHub itself.
 */
export const formatDateTime = (d: Date): string => `${d.toISOString().slice(0, 16).replace('T', ' ')} UTC`;

type Extent = {
	commits?: number;
	duration?: string;
};

/**
 * "118 commits · 7 weeks" — only the parts that were actually measured.
 * Returns null when nothing was, so a caller can skip the field label
 * entirely instead of rendering it against an empty value.
 *
 * LOC deliberately isn't a field here at all (Phase 3.2 dropped it): it
 * invites comparing 4,176 lines in two days against 1,726 over eight weeks,
 * and the larger number reads as generated volume, not more work.
 */
export function formatExtent(extent: Extent): string | null {
	const parts: string[] = [];
	if (extent.commits !== undefined) parts.push(`${extent.commits.toLocaleString('en-US')} commits`);
	if (extent.duration !== undefined) parts.push(extent.duration);
	return parts.length > 0 ? parts.join(' · ') : null;
}
