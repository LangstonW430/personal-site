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
	until?: Date;
	kind: 'education' | 'freelance' | 'employment' | 'research';
	title: string;
	org: string;
	summary?: string;
	detail?: string[];
};

export const CHRONOLOGY_KIND_LABEL: Record<ChronologyEntry['kind'], string> = {
	education: 'Education',
	freelance: 'Freelance',
	employment: 'Employment',
	research: 'Research',
};

/**
 * An entry nobody has ended yet. An `until` in the future counts as ongoing
 * too — a degree with an expected end date is something you are still doing,
 * not something finished.
 */
export function isOngoing(entry: ChronologyEntry, now: Date = new Date()): boolean {
	return entry.until === undefined || entry.until > now;
}

// Currently one consumer: the homepage's Experience section. It was two
// until /biographical-note/'s flat Chronology was dropped, and the helper
// stays a helper so a second consumer can't reintroduce a different sort or
// a different rule for unwritten entries. Undated entries ("date TBD") sort
// to the top, read as current/ongoing rather than oldest/unknown.
//
// Ongoing before ended, rather than one pass on start date. Sorting purely by
// start put a finished three-month internship above an ongoing freelance
// practice, and dropped the longest-running role — four years, ended most
// recently of any — to the bottom, because it began furthest back. What a
// reader wants first is what is true now.
//
// Within each group, most recent first: ongoing by when it started, ended by
// when it ended, with start date breaking a tie so two roles that finished the
// same month don't order arbitrarily.
export function sortedChronology(
	entries: ChronologyEntry[],
	now: Date = new Date(),
): ChronologyEntry[] {
	const time = (d: Date | undefined) => (d === undefined ? 0 : d.getTime());

	return entries
		.filter((entry) => !isUnwritten(entry.title))
		.slice()
		.sort((a, b) => {
			if (!a.date && !b.date) return 0;
			if (!a.date) return -1;
			if (!b.date) return 1;

			const aOngoing = isOngoing(a, now);
			if (aOngoing !== isOngoing(b, now)) return aOngoing ? -1 : 1;

			if (!aOngoing) {
				const byEnd = time(b.until) - time(a.until);
				if (byEnd !== 0) return byEnd;
			}

			return b.date.getTime() - a.date.getTime();
		});
}
