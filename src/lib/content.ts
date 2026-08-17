// The [[UNWRITTEN]] sentinel marks placeholder content in the repo so
// check:content can find it — it was never meant to be something a visitor
// reads. Any field that might hold the literal sentinel string checks it
// here before rendering, so an unfilled field disappears the same way any
// other absent optional field on this site does: no label, no gap, nothing
// to see. This is a general fix, not a per-field one — everywhere a short
// field value could be sentinel-flagged uses this, not a local comparison.

export const SENTINEL = '[[UNWRITTEN]]';

export function isUnwritten(value: string | null | undefined): boolean {
	return value === undefined || value === null || value.trim() === SENTINEL;
}

export type ChronologyEntry = {
	date?: Date;
	kind: 'education' | 'freelance' | 'employment';
	note: string;
	detail?: string;
};

export const CHRONOLOGY_KIND_LABEL: Record<ChronologyEntry['kind'], string> = {
	education: 'Education',
	freelance: 'Freelance',
	employment: 'Employment',
};

// Shared by the homepage's compact Experience section and the full
// Chronology on /biographical-note/, so the two can't sort or filter
// unwritten entries differently by accident. Undated entries ("date TBD")
// sort to the top, read as current/ongoing rather than oldest/unknown.
export function sortedChronology(entries: ChronologyEntry[]): ChronologyEntry[] {
	return entries
		.filter((entry) => !isUnwritten(entry.note))
		.sort((a, b) => {
			if (!a.date && !b.date) return 0;
			if (!a.date) return -1;
			if (!b.date) return 1;
			return b.date.getTime() - a.date.getTime();
		});
}
