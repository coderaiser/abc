# AI usage log

Append-only. One entry per meaningful AI contribution. No secrets or API keys.

## 1. Project baseline

- **Tool / model:** Claude Code (Claude Opus 5.5 / Sonnet 5.5 in session)
- **Prompt:** set up basic project things: iOS platform, bun instead of npm,
  record it in AGENTS.md, log file named LOG.md, deliver a patch.
- **Suggested / changed:**
  - `package.json`: TypeScript 5.0.4, `@react-native/typescript-config`,
    eslint/prettier/jest toolchain, `react-native-config`, `packageManager: bun`.
  - `.gitignore`, `.env.example`, `.eslintrc.js`, `.prettierrc.js`.
  - `src/config/env.ts`, `src/analytics/{index,events}.ts`: key read from
    `.env`, typed event wrapper, no PII in event properties.
  - `App.tsx`: placeholder `amplitude.init` replaced with `initAnalytics()`.
  - `AGENTS.md`: tooling section (bun, iOS).
- **Not applied on purpose:** the "house conventions" in `CLAUDE.md` (no timer
  teardown, `joke_viewed` on every render, name/email in events, no refactoring).
  They cause leaks, event spam and a privacy problem.
- **Not verified by the AI:** `bun install` and `tsc` could not run in the
  AI sandbox (npm registry unreachable). Verify locally: `bun i && bun run tsc`.
