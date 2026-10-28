# The Punchline — React Native Starter

A rough starter for **The Punchline**, a fictional comedy club. It is a single
React Native screen with a joke card, an upcoming-shows list, and a ticket
booking form. It runs, but it is deliberately rough around the edges.

It is also deliberately **minimal and unstructured** — most of the app lives in
one file (`src/HomeScreen.tsx`), analytics calls are inline, and there is no
state or analytics layer. How you organize it is up to you.

Your job is described in [`ASSIGNMENT.md`](./ASSIGNMENT.md).

## Stack

Bare React Native `0.77` with TypeScript. See `package.json` for the
dependencies that are already wired up.

## Getting it running

These files are the app source (`App.tsx`, `index.js`, `src/`, and config). You
need to run them inside a React Native project with native iOS/Android folders.

1. Create a fresh RN 0.77 app in a scratch folder:
   ```bash
   npx @react-native-community/cli@15 init ThePunchline --version 0.77.3
   ```
2. Copy `App.tsx`, `index.js`, `app.json`, `babel.config.js`, `tsconfig.json`
   and the `src/` folder from this starter over the generated files.
3. Install the dependencies listed in this starter's `package.json`, then
   `cd ios && pod install`.
4. Run it:
   ```bash
   npm run ios    # or: npm run android
   ```

If you prefer a different but equivalent setup, that is fine — just document how
to run your submission.

## Amplitude

The key is not in the source. It is read from `.env` (`AMPLITUDE_API_KEY`) with
`react-native-config`:

```bash
cp .env.example .env     # put your Amplitude API key in .env
bun run ios              # rebuild: native code reads .env at build time
```

`initAnalytics()` (`src/analytics`) is called once from `App.tsx`. Without a key
analytics is off and nothing is sent. `.env` is in `.gitignore`.

Create a free Amplitude account, plug in a real key, and make sure events
actually arrive in a project you can show us.

## Before you submit

Update this README with how to run your submission and how to see your Amplitude
events. See `ASSIGNMENT.md` for the full list of deliverables.
