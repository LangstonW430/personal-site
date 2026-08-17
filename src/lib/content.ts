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
