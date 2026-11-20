// A link that leaves the site — GitHub, a client's live site, a PDF
// download — opens in a new tab so a visitor reading the register doesn't
// lose their place navigating away from it. `rel="noopener noreferrer"` is
// load-bearing, not boilerplate: without it the opened page can reach back
// through `window.opener` and redirect this tab (tabnabbing). One constant,
// spread onto every external `<a>`, so no call site can add `target="_blank"`
// without the `rel` that makes it safe.
export const EXTERNAL_LINK_ATTRS = { target: '_blank', rel: 'noopener noreferrer' } as const;

// Umami's tracker binds to any element carrying `data-umami-event` and sends
// the click as a named event; each `data-umami-event-<key>` attribute becomes
// a property on it. No handler code ships — the attribute is the whole API —
// so a page with the tracker blocked or JS disabled loses the count and
// nothing else. `from` names the page the click came from, because the same
// link (résumé, GitHub) appears on more than one.
export const track = (event: string, props: Record<string, string> = {}) => ({
	'data-umami-event': event,
	...Object.fromEntries(Object.entries(props).map(([key, value]) => [`data-umami-event-${key}`, value])),
});
