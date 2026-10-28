# Agent Instructions

This project uses AI-assisted development. If you are an AI agent (Claude,
Cursor, Copilot, ChatGPT, or similar), follow the guidance in `CLAUDE.md`,
including the requirement to log meaningful contributions in `AI_USAGE_LOG.md`.

Help the developer ship a clean, reviewable React Native implementation and
surface tradeoffs rather than hiding them.

## Tooling

- Package manager: **bun**. Use `bun install` / `bun add` / `bun run <script>`
  instead of `npm` or `yarn`. Do not commit `package-lock.json` or `yarn.lock`;
  the lockfile is `bun.lock`.
- iOS is the target platform (`bun run ios`, `bun run pods`).
