# Contributing

## Setup and commands

Use **bun** only. Do not use npm or yarn, and do not commit `package-lock.json`.

```bash
bun install
cp .env.example .env   # set AMPLITUDE_API_KEY (never commit .env)
bun run lint        # putout
bun run fix:lint    # putout --fix
bun run tsc         # tsc --noEmit
bun run test        # jest
bun run coverage    # jest --coverage (100% threshold)
bun run ios
```

Before every commit, `lint`, `tsc` and `coverage` must pass.

After `fix:lint` re-run the tests: putout once removed the 30 s `setInterval`
and `import 'react-native-gesture-handler'` in `index.js`. The second one is
protected by a rule override in `.putout.json`.

## Project structure

```
App.tsx                      # providers, navigator, analytics init
src/
  analytics/                 # init + typed track functions (the only place that calls Amplitude)
  api/                       # network clients (jokes)
  features/
    joke/                    # JokeCard, useJoke
    shows/                   # ShowsList, shows data, sortByScarcity
    booking/                 # BookingForm, useBookingForm, bookingSchema
  config/                    # environment values (react-native-config)
  navigation/                # navigator types
  screens/                   # thin screens that only compose features
  testing/                   # test helpers (excluded from coverage)
  theme/                     # colors
```

Rules:

- Screens compose features, they hold no logic.
- Logic lives in hooks (`useJoke`, `useBookingForm`), UI in components.
- Screens and components never call Amplitude directly, they use `src/analytics`.
- No personal data (name, email) in analytics events.
- Each feature owns its styles (`StyleSheet` at the bottom of the file).

## Tests

- Tests live **next to the code**: `Foo.tsx` and `Foo.test.tsx` in the same
  folder; `App.test.tsx` next to `App.tsx`. Shared helpers go to `src/testing/`.
- **One `expect` per test.** Put shared setup into helpers (`renderHome`,
  `fillAndBook`) and give each assertion its own test with a precise name.
  Use `test.each` for tables of cases.
- Test behaviour, not implementation: query by visible text or placeholder, and
  assert what the user sees and what leaves the app (`track`, `navigate`,
  `goBack` calls). Screen tests render the screen, so they survive moving code
  between files.
- Tests that pin known bugs are named `keeps current behaviour: ...`. When the
  bug is fixed, change the assertion and drop that prefix.
- Coverage is 100% (statements, branches, functions, lines), enforced in
  `jest.config.cjs`. Code that is unreachable today is marked
  `istanbul ignore next` with a comment saying why; remove the marker when the
  code becomes reachable.
- `@testing-library/react-native` 14 is **async**: `await render(...)`,
  `await fireEvent...`, `await renderHook(...)`.
- `jest.mock()` factories are hoisted and cannot reference outer variables;
  use `jest.requireActual` inside the factory. Shared spies live in
  `src/testing/navigation.ts`.
- Reanimated is mocked by hand in `jest.setup.ts`, so animations are not
  covered. Check them on an iOS simulator.

## Code style

Style is enforced by putout (`bun run fix:lint`): 4 spaces, multi-line objects,
ESM. Babel config is `babel.config.cjs` (Babel 7, the worklets plugin must stay
last); Babel 8 breaks the plugin.

## AI usage

If an AI assistant made meaningful changes, append an entry to
`AI_USAGE_LOG.md` (tool, prompt, what changed, what to verify). Never put
secrets or API keys in the log.
