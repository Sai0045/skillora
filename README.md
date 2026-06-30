# Skillora

Skillora is a local self-paced Learning Management System prototype authored by Sairaj Abhale for an internship design assignment.

Tagline: Learn at your pace. Grow with purpose.

## Features

- Learner dashboard with continue learning, progress, weekly activity, streak, goal, recommendations, and recent certificate.
- Course catalogue with search, filters, sorting, featured course treatment, saved courses, enrolled progress, empty results, and mobile filters.
- Course detail pages with instructor information, outcomes, requirements, preview lesson, curriculum, demo reviews, FAQ, save, share, and start actions.
- Learning workspace with YouTube sample lessons, responsive curriculum drawer, manual completion, previous/next navigation, notes, bookmarks, local resources, quiz feedback, transcript, Q&A empty state, and keyboard shortcut help.
- Certificates route with cards, credential codes, share/copy actions, and printable certificate view.
- Profile route with demo learner data, weekly goal, preferred categories, reduced motion, theme preference, and local data reset.
- Fresh light and dark themes with a visible header toggle.
- Versioned browser storage for progress, notes, bookmarks, preferences, quiz attempts, and certificates.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

This project does not connect to any account, backend, database, analytics service, or deployment provider.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Architecture

```text
src/
  app/             App Router routes and route states
  components/      Reusable UI and page views
  data/            Typed static demo fixtures
  domain/          Tested pure progress, search, and quiz logic
  hooks/           Client hooks
  lib/             Formatting, route, and class helpers
  store/           Versioned local storage and reducer-backed state
  types/           LMS TypeScript model
  test/            Vitest coverage for core logic
```

## Demo Data

Instructors, ratings, learner counts, reviews, analytics, progress, and certificates are invented demo content. The learner name is Sairaj Abhale. Static course fixtures are not persisted; only user-specific local state is stored in `localStorage`.

## Video Behavior

Skillora embeds public YouTube sample lessons through standard embed URLs. The prototype does not integrate the YouTube IFrame API, so it stores only last-opened lessons and manual lesson completion, not exact playback progress.

## Deployment

No deployment is configured. The assignment result is intended to run locally.
