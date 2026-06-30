# Assumptions

- Skillora is a polished frontend prototype, not a production LMS.
- The app remains local and is not linked to Vercel, GitHub, Google, YouTube accounts, or any backend service.
- Browser `localStorage` is acceptable for demo persistence and uses schema version `1`.
- Instructors, reviews, ratings, learner counts, analytics, certificates, and seeded progress are invented demo content.
- The learner and project author are Sairaj Abhale.
- The public YouTube lessons are embedded through standard iframe URLs. Exact playback progress is not tracked because the YouTube IFrame API is not integrated.
- Certificate download uses the browser print flow for a printable local certificate view rather than generating a real PDF.
- Q&A is represented as a polished empty state because a real discussion system would require backend infrastructure outside scope.
- Course resources are safe local text files in `public/resources`.
- Automated tests focus on pure logic and storage. Browser interaction and responsive checks are recorded in `VERIFICATION.md`.
