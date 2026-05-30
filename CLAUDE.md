# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this repo is

**Workers AI Hackathon Helper Starter Kit** — a collection of independent,
copy-and-go starter projects that demonstrate calling [Cloudflare Workers
AI](https://developers.cloudflare.com/workers-ai/) from different stacks.
It is a teaching/demo kit (see the YouTube walkthroughs linked in
`README.md`), **not** a single deployable application. Each subdirectory is a
self-contained project with its own dependencies, config, and deploy lifecycle.

The default model used throughout is `@cf/meta/llama-3.3-70b-instruct-fp8-fast`
(the TypeScript demo uses `@cf/meta/llama-3.1-8b-instruct`). The model catalog
is at https://developers.cloudflare.com/workers-ai/models/.

## Repository layout

```
.
├── README.md            # Index of all starters + resource links
├── agenda.md            # Hackathon presentation agenda (not code)
├── inspiration.md       # Project ideas for participants (not code)
├── python/              # Streamlit + Cloudflare Python SDK (REST API) starter
└── workers/             # Cloudflare Workers starters (each is its own project)
    ├── hello-world-ai/      # Minimal JS Worker, single fetch handler
    ├── hello-hono-ai/       # JS Worker using Hono, with streaming examples
    └── typescript-based-api/# TS Hono API + static assets front-end (Etymologist.ai)
```

There is **no root-level package manager or workspace**. Treat each project
directory as the working root: `cd` into it before running its commands.

## The four starter projects

### `python/` — Streamlit chat app
- `app.py`: a Streamlit conversational chat UI that streams responses from
  Workers AI via the official `cloudflare` Python SDK (`Cloudflare(...).ai.with_streaming_response.run(...)`).
  It parses the SSE `data: {...}` lines and skips the `[DONE]` sentinel.
- Secrets live in `.streamlit/secrets.toml` (gitignored). Copy from
  `.streamlit/secrets.toml.example` and fill in `CLOUDFLARE_ACCOUNT_ID` and
  `CLOUDFLARE_API_TOKEN` from dash.cloudflare.com (AI → Use REST API).
- Dependencies: `cloudflare`, `streamlit`, `watchdog` (`requirements.txt`).

### `workers/hello-world-ai/` — minimal JS Worker
- `src/index.js`: single `fetch` handler calling `env.AI.run(...)` and returning JSON.
- No framework. The `[ai]` binding (`binding = "AI"`) in `wrangler.toml` is what
  exposes `env.AI`.

### `workers/hello-hono-ai/` — Hono JS Worker with streaming
- `src/index.js`: a [Hono](https://hono.dev) app with routes demonstrating three
  patterns — standard (non-streaming) AI call, raw `text/event-stream` passthrough,
  and `hono/streaming` `streamText` using `fetch-event-stream` to parse SSE chunks.

### `workers/typescript-based-api/` — TS Hono API + static front-end
- `src/index.ts`: typed Hono app (`Hono<{Bindings: Env}>`) with a single
  `POST /api/etymology` route that streams an AI response.
- `public/`: static front-end (`index.html`, `script.js`, `styles.css`) served via
  the `[assets]` binding in `wrangler.toml` (`directory = "./public"`). `script.js`
  consumes the streamed response with a `TextDecoderStream` reader.
- `Env` type is in `worker-configuration.d.ts`; regenerate with `npm run cf-typegen`
  (`wrangler types`).
- Note from its README: **the streaming demo only works when deployed**, not in
  local `wrangler dev`.

## Common workflows

All Worker projects share the same npm scripts (run from inside the project dir):

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` (or `npm start`) | Local dev server via `wrangler dev` (defaults to http://localhost:8787) |
| `npm run deploy` | Deploy to Cloudflare via `wrangler deploy` |
| `npm test` | Run Vitest (Workers pool) |
| `npm run cf-typegen` | (TS project only) regenerate the `Env` types |

Python project (from `python/`):
```bash
python -m venv venv && source ./venv/bin/activate
python -m pip install -r requirements.txt
python -m streamlit run app.py
```

Deploying any Worker requires authenticating Wrangler against a Cloudflare
account (e.g. `npx wrangler login`).

## Conventions

- **Formatting (Workers projects):** Prettier with **tabs**, single quotes,
  semicolons, `printWidth: 140` (`.prettierrc`). `.editorconfig` enforces tab
  indentation, LF endings, UTF-8, trimmed trailing whitespace, final newline
  (YAML uses spaces). Match the existing tab indentation when editing JS/TS.
- **Workers runtime config** lives in `wrangler.toml`. The files ship with a
  large commented catalog of available bindings (D1, KV, R2, Vectorize, Durable
  Objects, Queues, etc.) — uncomment to add a binding. `compatibility_date` is
  `2025-01-09` with `nodejs_compat`.
- **Workers AI access** is always via the `env.AI` / `c.env.AI` binding declared
  under `[ai]` in `wrangler.toml` — never via API keys inside Worker code. API
  tokens are only used by the Python REST-API path.
- **Streaming pattern:** Workers AI returns SSE (`data: {"response": "..."}` lines
  terminated by `data: [DONE]`). The repo uses `fetch-event-stream`'s `events()`
  to parse chunks and `hono/streaming`'s `streamText` to relay them; clients read
  via `TextDecoderStream`.
- **Tests** use `vitest` with `@cloudflare/vitest-pool-workers` and the
  `cloudflare:test` helpers (`env`, `createExecutionContext`,
  `waitOnExecutionContext`, `SELF`).

## Gotchas / known issues

These are existing flaws in the starter code — be aware before "fixing" or relying
on them:

- **The Worker test specs are stale boilerplate.** All three `test/index.spec.*`
  files still assert `"Hello World!"` and call `worker.fetch` on `/`, which none of
  the current workers return. They will fail / don't match the real handlers.
  `hello-world-ai` and `hello-hono-ai` integration tests also reference undefined
  `request`/`ctx`. Rewrite the tests to match the actual routes if test coverage
  is needed.
- **`typescript-based-api/package.json` has a bogus dependency** `"wrnagler": "^1.0.0"`
  (a typo of `wrangler`, which is already correctly listed under devDependencies).
  It is unused; consider removing it rather than installing it.

## Working in this repo

- Keep changes scoped to one starter project unless the task is explicitly
  cross-cutting; they are meant to stand alone.
- When adding a new starter, mirror the existing structure (own `package.json`,
  `wrangler.toml`, `.prettierrc`, `.editorconfig`, `README.md`) and add a link to
  it in the root `README.md`.
- Never commit real credentials. `secrets.toml`, `.env`, and `.venv`/`venv` are
  gitignored in `python/`.

## Git / PR workflow

- Active development branch: `claude/claude-md-docs-vHSXq`. Develop, commit, and
  push there; do not push to `main` without explicit permission.
- Push with `git push -u origin <branch>` and open a **draft** PR after pushing if
  one does not already exist.
