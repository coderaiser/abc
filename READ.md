# The Punchline (React Native 0.77, iOS)

## Run

Requirements: Xcode + an iOS simulator, CocoaPods, [bun](https://bun.sh).

The repo holds app source only (no `ios/` folder). Generate the native shell
once, then bring the source over it:

```bash
bunx @react-native-community/cli@15 init ThePunchline --version 0.77.3 --skip-install
# copy App.tsx index.js app.json babel.config.js tsconfig.json package.json
# .eslintrc.js .prettierrc.js .env.example and src/ into ThePunchline/
cd ThePunchline
cp .env.example .env     # put your Amplitude API key in .env
bun install
bun run pods
bun run ios
```

Checks: `bun run tsc`, `bun run lint`, `bun run test`.

## Amplitude

Key lives in `.env` (`AMPLITUDE_API_KEY`), never in source. Without a key,
analytics is a no-op. Events are defined in `src/analytics/events.ts`.
_(verification steps: to be added)_
