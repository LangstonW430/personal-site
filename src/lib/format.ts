// Shared field formatting for record and accrual pages. Kept in one place so
// the register, a record, and its accruals never disagree on how a date or
// an extent is written.

/** ISO date, e.g. "2026-06-14" — the format a record is dated in. */
export const formatDate = (d: Date): string => d.toISOString().slice(0, 10);

type Extent = {
	loc?: number;
	commits?: number;
	duration?: string;
};

/**
 * "4,180 LOC · 118 commits · 7 weeks" — only the parts that were actually
 * measured. Returns null when nothing was, so a caller can skip the field
 * label entirely instead of rendering it against an empty value.
 */
export function formatExtent(extent: Extent): string | null {
	const parts: string[] = [];
	if (extent.loc !== undefined) parts.push(`${extent.loc.toLocaleString('en-US')} LOC`);
	if (extent.commits !== undefined) parts.push(`${extent.commits.toLocaleString('en-US')} commits`);
	if (extent.duration !== undefined) parts.push(extent.duration);
	return parts.length > 0 ? parts.join(' · ') : null;
}
