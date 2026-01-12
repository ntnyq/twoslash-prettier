# Copilot Instructions

- Goal: twoslash-prettier exposes a Prettier-backed twoslash runner; inputs code + optional filename/ext, outputs twoslash-protocol nodes describing Prettier diffs.
- Entry point: core implementation and option types live in [src/index.ts](../src/index.ts); directory resolution helper in [src/dir.ts](../src/dir.ts); Prettier worker in [workers/prettier.cjs](../workers/prettier.cjs).
- API shape: `createTwoslasher(options)` returns a `TwoslashGenericFunction` that runs Prettier, diffs original vs formatted code via generate-differences, converts offsets to positions with twoslash-protocol, and returns `{ code, nodes }`.
- Default behavior: parser is chosen by extension from an internal map (js/ts/json/css/md/html/vue/yaml, etc.); filenames without dots become `index.<ext>` using `fallbackExtension` (default `ts`).
- Options: `prettierConfig` overrides options; `prettierConfigFile` lets Prettier resolve a config file; `prettierParserMap` augments the default parser map; `prettierCodeProcess` lets you mutate code before formatting; `mergeMessages` collapses errors that share start/length.
- Worker details: formatting is offloaded to a synckit worker [workers/prettier.cjs](../workers/prettier.cjs) (CJS on purpose); it lazily imports Prettier and resolves config via `resolveConfigFile`/`resolveConfig` when `options.config` is provided. Keep this file CJS and colocated with `workers` because [src/index.ts](../src/index.ts) loads it via `createSyncFn(join(DIR_WORKS, 'prettier.cjs'))`.
- Path handling: `DIR_WORKS` is resolved relative to `src/dir.ts`; avoid changing worker location without updating that constant.
- Output nodes: messages are labeled `prettier/<operation>` and include `Insert`/`Delete`/`Replace` text with invisibles rendered by show-invisibles; messages outside code bounds are filtered out before returning.
- Build toolchain: ESM package (`type: module`). Build via `pnpm build` (tsdown) which outputs `dist` and bundles `pathe` and `show-invisibles` as `noExternal` per [tsdown.config.ts](../tsdown.config.ts). Type declarations are emitted (`dts: true`).
- Testing: run `pnpm test` (vitest). Tests in [tests/index.test.ts](../tests/index.test.ts) glob fixtures, normalize CRLF, and snapshot results to `tests/results` using `toMatchFileSnapshot`; add new fixtures under `tests/fixtures` and update snapshots accordingly.
- Lint/typecheck: `pnpm lint` (eslint per eslint.config.mjs) and `pnpm typecheck` (tsc --noEmit). Release checks run lint+typecheck+test via `pnpm release:check`.
- Docs: VitePress-based docs under `docs/`; `pnpm docs:dev` / `pnpm docs:build` run via workspace package.json in that folder.
- Publishing: `files` include only `dist` and `workers`; ensure worker remains copied to published package. Prepublish runs `pnpm build`; versioning uses `pnpm release` (bumpp).
- Conventions: prefer pnpm (packageManager pinned), keep code strict/isolatedModules per [tsconfig.json](../tsconfig.json); project is sideEffect-free. Avoid non-ASCII unless required.
- Usage sanity check: ensure peer `prettier@^3` is available in consumer env; `prettierParserMap` should map extensions to Prettier parser names.
- Test data: json snapshots in `tests/results/*.json` and any throwing cases should go under `tests/fixtures/throws` with expected `.txt` snapshot.
- When changing parser maps or message merging logic, add fixtures covering new behaviors to keep snapshots authoritative.
