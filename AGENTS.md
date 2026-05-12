# Repository Guidelines

## Project Structure & Module Organization

The package implementation lives in `src/`: `index.ts` exposes `createTwoslasher`, while `dir.ts` resolves the worker path. Prettier runs through `workers/prettier.mjs`; keep its ESM boundary intact. Tests are in `tests/index.test.ts`, with inputs under `tests/fixtures/` and expected file snapshots under `tests/results/`. Documentation is a separate pnpm workspace in `docs/`; site configuration and Vue components live in `docs/.vitepress/`, and static assets live in `docs/public/`. Shared utilities belong in `scripts/`.

## Build, Test, and Development Commands

Use the pnpm version declared in `package.json`.

- `pnpm install --frozen-lockfile` installs exactly the locked dependencies.
- `pnpm dev` rebuilds the library with tsdown in watch mode.
- `pnpm build` creates the distributable files in `dist/`.
- `pnpm test` runs the Vitest suite once.
- `pnpm format:check`, `pnpm lint`, and `pnpm typecheck` run Oxfmt, ESLint, and strict TypeScript validation.
- `pnpm release:check` runs all formatting, linting, type, and test checks.
- `pnpm docs:dev` serves the documentation site; `pnpm docs:build` verifies its production build.

## Coding Style & Naming Conventions

Use ESM TypeScript, two-space indentation, LF line endings, single quotes, trailing commas, and no semicolons. Oxfmt is authoritative (`.oxfmtrc.jsonc`); ESLint uses `@ntnyq/eslint-config`. Use `camelCase` for variables and functions, `PascalCase` for exported types and Vue components, and descriptive lowercase filenames. Preserve the public `createTwoslasher` API unless a breaking change is intentional.

## Testing Guidelines

Vitest drives fixture-based snapshot tests. Add a fixture such as `tests/fixtures/markdown.md` and its matching `tests/results/markdown.json`; expected-error fixtures go under a `throws/` path and use `.txt` results. Add focused `it(...)` cases for behavior that needs setup. No coverage threshold is configured, so prioritize changed paths and edge cases. Run `pnpm test` before submitting.

## Commit & Pull Request Guidelines

Follow the repository’s Conventional Commit style: `feat: change worker to mjs`, `build: explicitly set platform to node`, or `chore(deps): update ...`. Keep each commit focused and use an imperative summary. Pull requests should explain the behavior change, link relevant issues, and list validation performed. Include before/after screenshots only for documentation or UI changes. Ensure the CI-equivalent format, lint, build, typecheck, and test commands pass.
