# Start Here for Codex

Copy this prompt into the new Codex thread after extracting the zip on another laptop.

```text
You are continuing a local-only Next.js project named Skillora.

Important constraints:
- Keep everything local. Do not connect this project to Vercel, GitHub, Google, Gmail, analytics, a database, auth, or any external account unless I explicitly ask later.
- Do not deploy the project.
- Do not rename the author or learner. The project author and demo learner are Sairaj Abhale.
- Treat all instructors, progress, ratings, reviews, certificates, analytics, and learner data as invented demo content.
- The app stores demo progress only in browser localStorage. There is no backend and no .env requirement.

First, inspect the project before making changes:
- README.md
- ASSUMPTIONS.md
- VERIFICATION.md
- package.json
- package-lock.json
- src/app
- src/components
- src/data
- src/domain
- src/store
- src/types

Project summary:
- App name: Skillora
- Framework: Next.js 16.2.9 with App Router
- React: 19.2.4
- Styling: Tailwind CSS v4 in src/app/globals.css
- Icons: lucide-react
- Tests: Vitest
- Persistence: versioned localStorage only
- Main routes:
  - / dashboard
  - /courses catalogue
  - /courses/[courseId] course details
  - /learn/[courseId]/[lessonId] learning workspace
  - /certificates certificates
  - /profile profile and preferences

Environment checks:
1. Open a terminal in the extracted skillora folder.
2. Run:
   node --version
   npm --version
3. Use Node.js 20.9 or newer. Node 24 was used during the original build.
4. Install dependencies:
   npm ci
   If npm ci fails because of local npm/package-lock differences, run npm install.
5. Verify locally:
   npm run lint
   npm run typecheck
   npm run test
   npm run build
6. Start the app:
   npm run dev
7. Open:
   http://localhost:3000

If build fails in a sandbox because Turbopack/PostCSS tries an internal process operation, rerun npm run build with approval outside the sandbox. This is still local-only and does not connect any account.

Manual checks after starting:
- Dashboard loads and has no horizontal scroll on desktop or mobile widths.
- The light/dark toggle works and uses the fresh mixed color palette.
- The app-level Back button appears in navigation and returns to the previous Skillora route, with dashboard as fallback.
- /courses search, filters, sorting, empty state, and course cards work.
- A course detail page opens and starts the learning workspace.
- The learning workspace supports previous/next lesson navigation, notes, bookmarks, manual completion, quiz feedback, transcript, local resources, and responsive curriculum drawer.
- /certificates shows earned and locked certificates, including printable certificate behavior.
- /profile shows Sairaj Abhale demo data, theme preference, reduced motion, weekly goal, and local reset.
- Mobile menu, mobile filters, and mobile lesson drawer open and close cleanly.

When making changes:
- Preserve the local-only architecture.
- Keep the fresh, non-generic visual style.
- Keep accessibility in mind: keyboard navigation, labels, focus states, readable contrast, and responsive layout.
- Update README.md, ASSUMPTIONS.md, and VERIFICATION.md when behavior or verification steps change.
- Run lint, typecheck, tests, and build before finishing.
```

