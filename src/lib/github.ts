// Server-only GitHub API client for the register's instrument panel. Plain
// `fetch` — the GitHub REST API is simple JSON over HTTPS and doesn't
// justify an SDK dependency. Never imported by anything that ships to the
// browser: this module only runs inside src/pages/index.astro's frontmatter,
// which executes server-side per request (see that file's `prerender = false`
// note for why).

const GITHUB_API = 'https://api.github.com';

// A hard budget for the whole panel, not per-request — Promise.all below
// fires every request under one shared AbortController, so one slow repo
// can't quietly add its timeout on top of another's.
const TIMEOUT_MS = 4000;

export type RepoStat = {
	owner: string;
	name: string;
	url: string;
	language: string | null;
	pushedAt: string;
	openIssues: number;
};

export type GithubPanelData = {
	publicRepoCount: number;
	repos: RepoStat[];
};

const GITHUB_SOURCE = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)\/?$/;

/** Parses a single `links.source` URL into (owner, repo), or null if it isn't a github.com repo URL. */
export function parseGithubSource(source: string | undefined): { owner: string; repo: string } | null {
	if (!source) return null;
	const match = GITHUB_SOURCE.exec(source);
	if (!match) return null;
	const [, owner, repo] = match;
	return { owner, repo };
}

/** Extracts (owner, repo) pairs from every record's `links.source`, in order, deduplicated. */
export function repoAllowlist(sources: (string | undefined)[]): { owner: string; repo: string }[] {
	const seen = new Set<string>();
	const list: { owner: string; repo: string }[] = [];
	for (const source of sources) {
		const parsed = parseGithubSource(source);
		if (!parsed) continue;
		const key = `${parsed.owner}/${parsed.repo}`;
		if (seen.has(key)) continue;
		seen.add(key);
		list.push(parsed);
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
 * Fetches the account's public repo count and one entry per allowlisted repo,
 * under a single hard timeout. Throws on any failure — including the
 * timeout — so the caller decides what "unavailable" looks like; this
 * function has no opinion about rendering.
 */
export async function fetchGithubPanel(
	username: string,
	repos: { owner: string; repo: string }[],
	token: string | undefined,
): Promise<GithubPanelData> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(new Error(`GitHub panel timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS);

	try {
		const [user, ...repoResults] = await Promise.all([
			githubGet(`/users/${username}`, token, controller.signal),
			...repos.map(({ owner, repo }) => githubGet(`/repos/${owner}/${repo}`, token, controller.signal)),
		]);

		return {
			publicRepoCount: user.public_repos,
			repos: repoResults.map((r) => ({
				owner: r.owner.login,
				name: r.name,
				url: r.html_url,
				language: r.language,
				pushedAt: r.pushed_at,
				openIssues: r.open_issues_count,
			})),
		};
	} finally {
		clearTimeout(timer);
	}
}

export type ReadmeData = {
	html: string;
};

// GitHub renders each heading's permalink icon (and every Table-of-Contents
// entry) as href="#slug" pointing at id="user-content-slug" — deliberately
// mismatched, because the prefix exists precisely so an embedded README
// doesn't collide with the host page's own ids. On github.com itself,
// their client-side router remaps the click; embedded here with zero
// client JS by design, an unresolved hash just does nothing; confirmed by
// hand against a real README (the on-page evidence: icons that render but
// don't navigate). Stripping the prefix once, server-side, at fetch time,
// makes href and id agree without shipping a line of JS to fix it in the
// browser instead.
function fixAnchorIds(html: string): string {
	return html.replace(/\bid="user-content-/g, 'id="');
}

/**
 * Fetches a repo's README pre-rendered to HTML by GitHub's own markdown
 * pipeline (`Accept: application/vnd.github.html+json`), rather than
 * bringing in a markdown parser as a dependency for something GitHub
 * already renders correctly — GFM tables, task lists, and relative
 * image/link resolution against the repo's default branch all come for
 * free. This is the same HTML GitHub shows on the repo's own homepage, so
 * embedding it via `set:html` carries no more trust risk than that already
 * does — these are Langston's own repos, not arbitrary user content.
 *
 * Returns null rather than throwing on any failure (404, no README,
 * private repo, rate limit, timeout) — the caller renders an honest
 * "unavailable" state the same way the instrument panel does, not a crash.
 */
export async function fetchReadme(
	owner: string,
	repo: string,
	token: string | undefined,
): Promise<ReadmeData | null> {
	const controller = new AbortController();
	const timer = setTimeout(
		() => controller.abort(new Error(`README fetch for ${owner}/${repo} timed out after ${TIMEOUT_MS}ms`)),
		TIMEOUT_MS,
	);

	try {
		const headers: Record<string, string> = {
			Accept: 'application/vnd.github.html+json',
			'X-GitHub-Api-Version': '2022-11-28',
		};
		if (token) headers.Authorization = `Bearer ${token}`;

		const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
			headers,
			signal: controller.signal,
		});
		if (!response.ok) return null;

		const html = fixAnchorIds((await response.text()).trim());
		return html ? { html } : null;
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
