/**
 * Tests for CLAUDE.md
 *
 * CLAUDE.md is a documentation file that describes the repository structure,
 * conventions, and workflows for AI assistants. These tests verify that the
 * documentation accurately reflects the actual state of the repository.
 *
 * Run with: node --test test/claude-md.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CLAUDE_MD_PATH = path.join(ROOT, 'CLAUDE.md');

function readClaudeMd() {
	return fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
}

function repoPath(...parts) {
	return path.join(ROOT, ...parts);
}

function fileExists(...parts) {
	return fs.existsSync(repoPath(...parts));
}

function readJson(...parts) {
	return JSON.parse(fs.readFileSync(repoPath(...parts), 'utf8'));
}

// ─────────────────────────────────────────────
// File existence and basic integrity
// ─────────────────────────────────────────────

describe('CLAUDE.md file', () => {
	it('exists at the repository root', () => {
		assert.ok(fileExists('CLAUDE.md'), 'CLAUDE.md must exist at the repository root');
	});

	it('is non-empty', () => {
		const content = readClaudeMd();
		assert.ok(content.length > 0, 'CLAUDE.md must not be empty');
	});

	it('starts with a top-level heading', () => {
		const content = readClaudeMd();
		assert.ok(content.startsWith('# CLAUDE.md'), 'CLAUDE.md must start with "# CLAUDE.md"');
	});

	it('ends with a newline', () => {
		const content = readClaudeMd();
		assert.ok(content.endsWith('\n'), 'CLAUDE.md must end with a newline');
	});
});

// ─────────────────────────────────────────────
// Required sections (H2 headings)
// ─────────────────────────────────────────────

describe('CLAUDE.md required sections', () => {
	const REQUIRED_SECTIONS = [
		'## What this repo is',
		'## Repository layout',
		'## The four starter projects',
		'## Common workflows',
		'## Conventions',
		'## Gotchas / known issues',
		'## Working in this repo',
		'## Git / PR workflow',
	];

	for (const section of REQUIRED_SECTIONS) {
		it(`contains section "${section}"`, () => {
			const content = readClaudeMd();
			assert.ok(content.includes(section), `CLAUDE.md must contain the section: ${section}`);
		});
	}
});

// ─────────────────────────────────────────────
// Repository layout accuracy
// ─────────────────────────────────────────────

describe('CLAUDE.md repository layout - paths exist', () => {
	const REQUIRED_PATHS = [
		['README.md'],
		['agenda.md'],
		['inspiration.md'],
		['python'],
		['workers'],
		['workers', 'hello-world-ai'],
		['workers', 'hello-hono-ai'],
		['workers', 'typescript-based-api'],
	];

	for (const parts of REQUIRED_PATHS) {
		it(`path exists: ${parts.join('/')}`, () => {
			assert.ok(fileExists(...parts), `Expected path to exist: ${parts.join('/')}`);
		});
	}

	it('has no root-level package.json (as documented)', () => {
		assert.ok(!fileExists('package.json'), 'Root-level package.json must not exist per CLAUDE.md');
	});
});

// ─────────────────────────────────────────────
// Starter project file structure
// ─────────────────────────────────────────────

describe('CLAUDE.md starter project structure - python/', () => {
	it('python/app.py exists', () => {
		assert.ok(fileExists('python', 'app.py'), 'python/app.py must exist');
	});

	it('python/requirements.txt exists', () => {
		assert.ok(fileExists('python', 'requirements.txt'), 'python/requirements.txt must exist');
	});

	it('python/.streamlit/secrets.toml.example exists', () => {
		assert.ok(
			fileExists('python', '.streamlit', 'secrets.toml.example'),
			'python/.streamlit/secrets.toml.example must exist',
		);
	});

	it('python/requirements.txt contains the documented dependencies', () => {
		const content = fs.readFileSync(repoPath('python', 'requirements.txt'), 'utf8');
		const deps = content
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);
		assert.ok(deps.includes('cloudflare'), 'requirements.txt must include cloudflare');
		assert.ok(deps.includes('streamlit'), 'requirements.txt must include streamlit');
		assert.ok(deps.includes('watchdog'), 'requirements.txt must include watchdog');
	});
});

describe('CLAUDE.md starter project structure - workers/hello-world-ai/', () => {
	it('src/index.js exists', () => {
		assert.ok(fileExists('workers', 'hello-world-ai', 'src', 'index.js'), 'workers/hello-world-ai/src/index.js must exist');
	});

	it('wrangler.toml exists', () => {
		assert.ok(fileExists('workers', 'hello-world-ai', 'wrangler.toml'), 'workers/hello-world-ai/wrangler.toml must exist');
	});

	it('package.json exists', () => {
		assert.ok(fileExists('workers', 'hello-world-ai', 'package.json'), 'workers/hello-world-ai/package.json must exist');
	});

	it('.prettierrc exists', () => {
		assert.ok(fileExists('workers', 'hello-world-ai', '.prettierrc'), 'workers/hello-world-ai/.prettierrc must exist');
	});

	it('.editorconfig exists', () => {
		assert.ok(fileExists('workers', 'hello-world-ai', '.editorconfig'), 'workers/hello-world-ai/.editorconfig must exist');
	});
});

describe('CLAUDE.md starter project structure - workers/hello-hono-ai/', () => {
	it('src/index.js exists', () => {
		assert.ok(fileExists('workers', 'hello-hono-ai', 'src', 'index.js'), 'workers/hello-hono-ai/src/index.js must exist');
	});

	it('wrangler.toml exists', () => {
		assert.ok(fileExists('workers', 'hello-hono-ai', 'wrangler.toml'), 'workers/hello-hono-ai/wrangler.toml must exist');
	});

	it('package.json exists', () => {
		assert.ok(fileExists('workers', 'hello-hono-ai', 'package.json'), 'workers/hello-hono-ai/package.json must exist');
	});

	it('.prettierrc exists', () => {
		assert.ok(fileExists('workers', 'hello-hono-ai', '.prettierrc'), 'workers/hello-hono-ai/.prettierrc must exist');
	});

	it('.editorconfig exists', () => {
		assert.ok(fileExists('workers', 'hello-hono-ai', '.editorconfig'), 'workers/hello-hono-ai/.editorconfig must exist');
	});
});

describe('CLAUDE.md starter project structure - workers/typescript-based-api/', () => {
	it('src/index.ts exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'src', 'index.ts'),
			'workers/typescript-based-api/src/index.ts must exist',
		);
	});

	it('wrangler.toml exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'wrangler.toml'),
			'workers/typescript-based-api/wrangler.toml must exist',
		);
	});

	it('package.json exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'package.json'),
			'workers/typescript-based-api/package.json must exist',
		);
	});

	it('.prettierrc exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', '.prettierrc'),
			'workers/typescript-based-api/.prettierrc must exist',
		);
	});

	it('.editorconfig exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', '.editorconfig'),
			'workers/typescript-based-api/.editorconfig must exist',
		);
	});

	it('public/index.html exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'public', 'index.html'),
			'workers/typescript-based-api/public/index.html must exist',
		);
	});

	it('public/script.js exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'public', 'script.js'),
			'workers/typescript-based-api/public/script.js must exist',
		);
	});

	it('public/styles.css exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'public', 'styles.css'),
			'workers/typescript-based-api/public/styles.css must exist',
		);
	});

	it('worker-configuration.d.ts exists', () => {
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'worker-configuration.d.ts'),
			'workers/typescript-based-api/worker-configuration.d.ts must exist',
		);
	});
});

// ─────────────────────────────────────────────
// npm scripts accuracy
// ─────────────────────────────────────────────

describe('CLAUDE.md documented npm scripts match package.json', () => {
	const WORKER_PROJECTS = ['hello-world-ai', 'hello-hono-ai', 'typescript-based-api'];
	const COMMON_SCRIPTS = ['deploy', 'dev', 'start', 'test'];

	for (const project of WORKER_PROJECTS) {
		for (const script of COMMON_SCRIPTS) {
			it(`workers/${project} has script "${script}"`, () => {
				const pkg = readJson('workers', project, 'package.json');
				assert.ok(
					pkg.scripts && script in pkg.scripts,
					`workers/${project}/package.json must have script "${script}"`,
				);
			});
		}
	}

	it('only typescript-based-api has cf-typegen script (TS project only)', () => {
		const tsPkg = readJson('workers', 'typescript-based-api', 'package.json');
		assert.ok(
			tsPkg.scripts && 'cf-typegen' in tsPkg.scripts,
			'workers/typescript-based-api/package.json must have cf-typegen script',
		);

		const hwPkg = readJson('workers', 'hello-world-ai', 'package.json');
		assert.ok(
			!hwPkg.scripts || !('cf-typegen' in hwPkg.scripts),
			'workers/hello-world-ai/package.json must not have cf-typegen script',
		);

		const hhPkg = readJson('workers', 'hello-hono-ai', 'package.json');
		assert.ok(
			!hhPkg.scripts || !('cf-typegen' in hhPkg.scripts),
			'workers/hello-hono-ai/package.json must not have cf-typegen script',
		);
	});

	it('cf-typegen script runs "wrangler types" as documented', () => {
		const pkg = readJson('workers', 'typescript-based-api', 'package.json');
		assert.equal(pkg.scripts['cf-typegen'], 'wrangler types', 'cf-typegen must run "wrangler types"');
	});
});

// ─────────────────────────────────────────────
// Known gotchas accuracy
// ─────────────────────────────────────────────

describe('CLAUDE.md known issues - bogus dependency', () => {
	it('documents "wrnagler" typo which actually exists in typescript-based-api/package.json', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('wrnagler'),
			'CLAUDE.md must document the "wrnagler" typo',
		);

		const pkg = readJson('workers', 'typescript-based-api', 'package.json');
		assert.ok(
			pkg.dependencies && 'wrnagler' in pkg.dependencies,
			'The bogus "wrnagler" dependency must be present in typescript-based-api/package.json (as documented)',
		);
	});

	it('"wrangler" (correctly spelled) is listed under devDependencies in typescript-based-api', () => {
		const pkg = readJson('workers', 'typescript-based-api', 'package.json');
		assert.ok(
			pkg.devDependencies && 'wrangler' in pkg.devDependencies,
			'"wrangler" must be in devDependencies (the correct entry)',
		);
	});

	it('documents stale test specs asserting "Hello World!"', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('Hello World!'),
			'CLAUDE.md must document the stale "Hello World!" test issue',
		);
		assert.ok(
			content.includes('stale boilerplate') || content.includes('stale'),
			'CLAUDE.md must describe the test specs as stale',
		);
	});

	it('stale spec files actually exist as documented', () => {
		assert.ok(
			fileExists('workers', 'hello-world-ai', 'test', 'index.spec.js'),
			'workers/hello-world-ai/test/index.spec.js must exist',
		);
		assert.ok(
			fileExists('workers', 'hello-hono-ai', 'test', 'index.spec.js'),
			'workers/hello-hono-ai/test/index.spec.js must exist',
		);
		assert.ok(
			fileExists('workers', 'typescript-based-api', 'test', 'index.spec.ts'),
			'workers/typescript-based-api/test/index.spec.ts must exist',
		);
	});
});

// ─────────────────────────────────────────────
// Model names format
// ─────────────────────────────────────────────

describe('CLAUDE.md model name references', () => {
	it('documents the default model in @cf/ format', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('@cf/meta/llama-3.3-70b-instruct-fp8-fast'),
			'CLAUDE.md must reference the default model @cf/meta/llama-3.3-70b-instruct-fp8-fast',
		);
	});

	it('documents the TypeScript demo model in @cf/ format', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('@cf/meta/llama-3.1-8b-instruct'),
			'CLAUDE.md must reference the TS demo model @cf/meta/llama-3.1-8b-instruct',
		);
	});

	it('both model references start with @cf/ prefix', () => {
		const content = readClaudeMd();
		const modelMatches = content.match(/@cf\/[^\s`]+/g) || [];
		assert.ok(modelMatches.length >= 2, 'CLAUDE.md must reference at least 2 @cf/ models');
		for (const model of modelMatches) {
			assert.ok(model.startsWith('@cf/'), `Model reference "${model}" must start with @cf/`);
		}
	});
});

// ─────────────────────────────────────────────
// Security: no hardcoded credentials
// ─────────────────────────────────────────────

describe('CLAUDE.md security - no hardcoded credentials', () => {
	const CREDENTIAL_PATTERNS = [
		/CLOUDFLARE_API_TOKEN\s*=\s*[^\n\s{]+/,
		/CLOUDFLARE_ACCOUNT_ID\s*=\s*[^\n\s{]+/,
		/Bearer\s+[A-Za-z0-9\-_]{20,}/,
		/api[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/i,
	];

	for (const pattern of CREDENTIAL_PATTERNS) {
		it(`does not contain hardcoded credential pattern: ${pattern}`, () => {
			const content = readClaudeMd();
			assert.ok(
				!pattern.test(content),
				`CLAUDE.md must not contain hardcoded credentials matching: ${pattern}`,
			);
		});
	}

	it('only mentions credential variable names as placeholders, not values', () => {
		const content = readClaudeMd();
		// CLOUDFLARE_ACCOUNT_ID may appear, but never with an actual value assigned
		const credentialValuePattern = /CLOUDFLARE_ACCOUNT_ID\s*=\s*[a-f0-9]{32}/;
		assert.ok(!credentialValuePattern.test(content), 'CLAUDE.md must not contain actual account IDs');
	});
});

// ─────────────────────────────────────────────
// Git / PR workflow conventions
// ─────────────────────────────────────────────

describe('CLAUDE.md git workflow section', () => {
	it('documents feature branch requirement', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('feature branch') || content.includes('feature-branch'),
			'CLAUDE.md must document developing on a feature branch',
		);
	});

	it('prohibits direct push to main', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('main'),
			'CLAUDE.md must mention the main branch',
		);
		assert.ok(
			content.toLowerCase().includes('do not push') || content.includes('without explicit permission'),
			'CLAUDE.md must warn against direct pushes to main',
		);
	});

	it('documents draft PR requirement', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('draft') || content.includes('draft PR'),
			'CLAUDE.md must mention opening a draft PR',
		);
	});
});

// ─────────────────────────────────────────────
// Conventions accuracy
// ─────────────────────────────────────────────

describe('CLAUDE.md conventions - vitest test framework', () => {
	it('documents vitest as the test framework', () => {
		const content = readClaudeMd();
		assert.ok(content.includes('vitest'), 'CLAUDE.md must document vitest as the test framework');
	});

	it('documents @cloudflare/vitest-pool-workers', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('@cloudflare/vitest-pool-workers'),
			'CLAUDE.md must document @cloudflare/vitest-pool-workers',
		);
	});

	it('all worker package.json devDependencies include vitest', () => {
		const projects = ['hello-world-ai', 'hello-hono-ai', 'typescript-based-api'];
		for (const project of projects) {
			const pkg = readJson('workers', project, 'package.json');
			assert.ok(
				pkg.devDependencies && 'vitest' in pkg.devDependencies,
				`workers/${project}/package.json must have vitest in devDependencies`,
			);
		}
	});

	it('all worker package.json devDependencies include @cloudflare/vitest-pool-workers', () => {
		const projects = ['hello-world-ai', 'hello-hono-ai', 'typescript-based-api'];
		for (const project of projects) {
			const pkg = readJson('workers', project, 'package.json');
			assert.ok(
				pkg.devDependencies && '@cloudflare/vitest-pool-workers' in pkg.devDependencies,
				`workers/${project}/package.json must have @cloudflare/vitest-pool-workers in devDependencies`,
			);
		}
	});
});

describe('CLAUDE.md conventions - Prettier formatting', () => {
	it('documents Prettier with tabs', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('Prettier') && content.includes('tabs'),
			'CLAUDE.md must document Prettier with tabs',
		);
	});

	it('.prettierrc files exist in all worker projects', () => {
		const projects = ['hello-world-ai', 'hello-hono-ai', 'typescript-based-api'];
		for (const project of projects) {
			assert.ok(
				fileExists('workers', project, '.prettierrc'),
				`workers/${project}/.prettierrc must exist`,
			);
		}
	});

	it('.editorconfig files exist in all worker projects', () => {
		const projects = ['hello-world-ai', 'hello-hono-ai', 'typescript-based-api'];
		for (const project of projects) {
			assert.ok(
				fileExists('workers', project, '.editorconfig'),
				`workers/${project}/.editorconfig must exist`,
			);
		}
	});
});

describe('CLAUDE.md conventions - wrangler.toml', () => {
	it('documents wrangler.toml as the Workers runtime config', () => {
		const content = readClaudeMd();
		assert.ok(content.includes('wrangler.toml'), 'CLAUDE.md must reference wrangler.toml');
	});

	it('wrangler.toml files exist in all worker projects', () => {
		const projects = ['hello-world-ai', 'hello-hono-ai', 'typescript-based-api'];
		for (const project of projects) {
			assert.ok(
				fileExists('workers', project, 'wrangler.toml'),
				`workers/${project}/wrangler.toml must exist`,
			);
		}
	});

	it('documents compatibility_date as 2025-01-09', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('2025-01-09'),
			'CLAUDE.md must document compatibility_date as 2025-01-09',
		);
	});

	it('documents nodejs_compat feature flag', () => {
		const content = readClaudeMd();
		assert.ok(
			content.includes('nodejs_compat'),
			'CLAUDE.md must document the nodejs_compat compatibility flag',
		);
	});
});

// ─────────────────────────────────────────────
// Credential / secret gitignore claims
// ─────────────────────────────────────────────

describe('CLAUDE.md credential safety - gitignore claims', () => {
	it('python/.gitignore exists to protect secrets', () => {
		assert.ok(fileExists('python', '.gitignore'), 'python/.gitignore must exist');
	});

	it('python/.gitignore ignores secrets.toml', () => {
		const content = fs.readFileSync(repoPath('python', '.gitignore'), 'utf8');
		assert.ok(
			content.includes('secrets.toml') || content.includes('.streamlit'),
			'python/.gitignore must ignore secrets.toml or .streamlit directory',
		);
	});

	it('python/secrets.toml is not committed (only the example file)', () => {
		assert.ok(
			!fileExists('python', '.streamlit', 'secrets.toml'),
			'python/.streamlit/secrets.toml must not be committed (only secrets.toml.example should exist)',
		);
	});
});

// ─────────────────────────────────────────────
// Boundary / negative tests
// ─────────────────────────────────────────────

describe('CLAUDE.md boundary and negative cases', () => {
	it('does not document a fifth starter project that does not exist', () => {
		// CLAUDE.md says "four starter projects" — validate the exact count
		const content = readClaudeMd();
		assert.ok(
			content.includes('four starter projects') || content.includes('The four starter projects'),
			'CLAUDE.md must refer to exactly four starter projects',
		);

		// Only the four documented directories should exist under workers/
		const workersDir = repoPath('workers');
		const entries = fs.readdirSync(workersDir, { withFileTypes: true });
		const subdirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
		const expectedWorkers = ['hello-world-ai', 'hello-hono-ai', 'typescript-based-api'];
		for (const expected of expectedWorkers) {
			assert.ok(subdirs.includes(expected), `workers/ must contain ${expected}`);
		}
		// python/ is separate, so workers/ should only have 3 dirs
		assert.equal(subdirs.length, 3, 'workers/ must contain exactly 3 subdirectories (3 Worker starters)');
	});

	it('does not contain Windows-style CRLF line endings', () => {
		const content = readClaudeMd();
		assert.ok(!content.includes('\r\n'), 'CLAUDE.md must use LF line endings, not CRLF');
	});

	it('CLAUDE.md line count matches the expected range (substantial documentation)', () => {
		const content = readClaudeMd();
		const lines = content.split('\n').length;
		// The PR added 140 lines; allow some tolerance for trailing newline
		assert.ok(lines >= 135, `CLAUDE.md must have at least 135 lines (found ${lines})`);
		assert.ok(lines <= 200, `CLAUDE.md must not have grown unexpectedly beyond 200 lines (found ${lines})`);
	});

	it('has no TODO or FIXME markers left in the documentation', () => {
		const content = readClaudeMd();
		assert.ok(!content.includes('TODO'), 'CLAUDE.md must not contain unresolved TODO markers');
		assert.ok(!content.includes('FIXME'), 'CLAUDE.md must not contain FIXME markers');
	});
});
