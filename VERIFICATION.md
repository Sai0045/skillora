# Verification

Date: 2026-06-30

## Automated Checks

- `npm run lint` - passed.
- `npm run typecheck` - passed.
- `npm run test` - passed, 1 test file and 8 tests.
- `npm run build` - passed, 26 static pages generated.

Notes:

- An earlier build failed because `next/font/google` attempted to fetch Google-hosted fonts. The app was changed to use a local system font stack.
- The build needed to run outside the sandbox because Turbopack/PostCSS attempted an internal process operation blocked by sandboxing. No account connection or deployment was performed.

## Manual Checks

Local browser checks were run with a headless Chrome CDP smoke script against `http://localhost:3000`.

Passed checks:

- Dashboard loads with continue-learning content.
- Header light/dark theme toggle changes the resolved theme.
- Catalogue search, reset, filters, and empty state render.
- Course details navigate into the learning workspace.
- App-level Back button returns to the previous Skillora route, with dashboard fallback.
- Featured course media remains within a stable height and no longer stretches vertically.
- Learning workspace supports bookmark, manual completion, notes, refresh persistence, and keyboard shortcut dialog.
- Quiz answers show scoring feedback.
- Certificates, printable certificate view, profile, and not-found route render.
- Mobile filter drawer and mobile curriculum drawer open and close.
- Dashboard has no horizontal scroll at 360x800, 390x844, 768x1024, 1024x768, 1280x800, and 1440x900.
- YouTube iframe embed URL is present for the HTML sample lesson.
- No framework error overlay detected.

Expected console note:

- The smoke script intentionally visited `/missing-route` to verify the not-found state, which produced one expected 404 resource message.

## Required Search Sweep

Sweep completed with `rg` and a duplicate-id script.

- No TODO, FIXME, Lorem Ipsum, `console.log`, `dangerouslySetInnerHTML`, or credential-like values were found in project source.
- No duplicate literal JSX IDs were found.
- Search found legitimate input `placeholder` attributes, a valid skip-link `href="#main-content"`, and scaffold SVG internal IDs in unused public SVG files.
- Search found the word `any` only in prose such as "any account"; no TypeScript `any` usage was found in source.
