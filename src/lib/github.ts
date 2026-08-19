// Server-only GitHub API client for the register's instrument panel. Plain
// `fetch` — the GitHub REST API is simple JSON over HTTPS and doesn't
// justify an SDK dependency. Never imported by anything that ships to the
// browser: this module only runs inside src/pages/index.astro's frontmatter,
// which executes server-side per request (see that file's `prerender = false`
// note for why).

const GITHUB_API = 'https://api.github.com';

// A hard budget for the whole panel. Since the panel is one request, this is
// also the per-request budget — but it stays named for the panel, because the
// thing being protected is the homepage's time to first byte, not any
// particular call.
const TIMEOUT_MS = 4000;

// One page covers the account comfortably (14 public repos as of Aug 2026).
// Because the listing is requested `sort=pushed`, the only thing a truncated
// first page could cost is a tracked repo that had gone untouched longer than
// 99 others — it would lose its row, and the headline (which reads off the
// rows) would follow the remaining ones. Degrades to less data, never to a
// wrong figure.
const PER_PAGE = 100;

export type RepoStat = {
	owner: string;
	name: string;
	url: string;
	pushedAt: string;
	/** The record this repo is the source for — the panel labels rows with it. */
	acc: string;
	title: string;
};

export type GithubPanelData = {
	/**
	 * Most recent push among TRACKED repos — always equal to `repos[0]`, never
	 * derived independently.
	 *
	 * It was briefly account-wide, which put a date in the headline that no row
	 * beneath it could account for: the account's newest push is usually to
	 * this site's own repo, which carries no `links.source` and so cannot be
	 * listed. A summary claiming a wider population than the list it heads
	 * reads as broken data, and correctly so.
	 *
	 * Tying it to `repos[0]` makes the disagreement structurally impossible
	 * rather than merely absent today. It is also the more relevant claim: the
	 * panel exists to show the catalogued work is live, and a push to a private
	 * client site or an old coursework repo is not evidence about anything in
	 * the register.
	 */
	mostRecentPush: string | null;
	repos: RepoStat[];
};

const GITHUB_SOURCE = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)\/?$/;

export type TrackedRepo = { owner: string; repo: string; acc: string; title: string };

/** Parses a single `links.source` URL into (owner, repo), or null if it isn't a github.com repo URL. */
export function parseGithubSource(source: string | undefined): { owner: string; repo: string } | null {
	if (!source) return null;
	const match = GITHUB_SOURCE.exec(source);
	if (!match) return null;
	const [, owner, repo] = match;
	return { owner, repo };
}

/**
 * Extracts the repos worth tracking from every record's `links.source`, in
 * order, deduplicated — carrying each record's accession and title along so
 * the panel can name a row after the work rather than after a URL slug.
 */
export function repoAllowlist(
	records: { source: string | undefined; acc: string; title: string }[],
): TrackedRepo[] {
	const seen = new Set<string>();
	const list: TrackedRepo[] = [];
	for (const record of records) {
		const parsed = parseGithubSource(record.source);
		if (!parsed) continue;
		const key = `${parsed.owner}/${parsed.repo}`.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		list.push({ ...parsed, acc: record.acc, title: record.title });
	}
	return list;
}

async function githubGet(path: string, token: string | undefined, signal: AbortSignal) {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
	};
	if (token) headers.Authorization = `Bearer ${token}`;

	const response = await fetch(`${GITHUB_API}${path}`, { headers, signal });
	if (!response.ok) {
		throw new Error(`GitHub API ${path} responded ${response.status}`);
	}
	return response.json();
}

/**
 * Fetches one entry per tracked repo, newest push first, in a single request
 * under a hard timeout.
 *
 * One, not one-per-repo. The listing endpoint already carries `pushed_at` for
 * every public repo, so tracked repos are looked up in that response rather
 * than fetched individually. Cost is constant in the number of records:
 * adding a fourth record with a `links.source` costs nothing, where the
 * original shape spent a request on each. That matters against the
 * unauthenticated ceiling of 60 requests/hour.
 *
 * Throws on any failure — including the timeout — so the caller decides what
 * "unavailable" looks like; this function has no opinion about rendering.
 */
export async function fetchGithubPanel(
	username: string,
	tracked: TrackedRepo[],
	token: string | undefined,
): Promise<GithubPanelData> {
	const controller = new AbortController();
	const timer = setTimeout(
		() => controller.abort(new Error(`GitHub panel timed out after ${TIMEOUT_MS}ms`)),
		TIMEOUT_MS,
	);

	try {
		const allRepos = await githubGet(
			`/users/${username}/repos?sort=pushed&per_page=${PER_PAGE}`,
			token,
			controller.signal,
		);

		const byFullName = new Map<string, { html_url: string; pushed_at: string; name: string; owner: { login: string } }>(
			(allRepos as { full_name: string }[]).map((repo) => [repo.full_name.toLowerCase(), repo as never]),
		);

		const repos: RepoStat[] = tracked
			// A tracked repo missing from the listing — renamed, deleted, made
			// private, or owned by someone else — drops its row instead of
			// failing the panel. One bad `links.source` should cost one line,
			// not the whole section.
			.flatMap((entry) => {
				const repo = byFullName.get(`${entry.owner}/${entry.repo}`.toLowerCase());
				if (!repo) return [];
				return [
					{
						owner: repo.owner.login,
						name: repo.name,
						url: repo.html_url,
						pushedAt: repo.pushed_at,
						acc: entry.acc,
						title: entry.title,
					},
				];
			})
			// Most recently pushed first. The panel is an activity readout, so
			// it sorts by activity — not by accession order, which the register
			// table above already presents.
			.sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));

		// Read off the sorted list, never computed separately — see the note on
		// GithubPanelData. The headline is the top row by construction.
		return { mostRecentPush: repos[0]?.pushedAt ?? null, repos };
	} finally {
		clearTimeout(timer);
	}
}
