// A link that leaves the site — GitHub, a client's live site, a PDF
// download — opens in a new tab so a visitor reading the register doesn't
// lose their place navigating away from it. `rel="noopener noreferrer"` is
// load-bearing, not boilerplate: without it the opened page can reach back
// through `window.opener` and redirect this tab (tabnabbing). One constant,
// spread onto every external `<a>`, so no call site can add `target="_blank"`
// without the `rel` that makes it safe.
export const EXTERNAL_LINK_ATTRS = { target: '_blank', rel: 'noopener noreferrer' } as const;
