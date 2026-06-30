import type { Course, Quiz } from "@/types/lms";

const lessonResources = [
  {
    id: "resource-focus-checklist",
    title: "Lesson focus checklist",
    kind: "download" as const,
    href: "/resources/focus-checklist.txt",
    description: "A short planning checklist for applying the lesson in practice.",
  },
  {
    id: "resource-practice-brief",
    title: "Practice brief",
    kind: "download" as const,
    href: "/resources/practice-brief.txt",
    description: "A small exercise brief you can complete after the lesson.",
  },
];

export const courses: Course[] = [
  {
    id: "frontend-foundations",
    title: "Modern Frontend Foundations",
    tagline: "Build calm, resilient interfaces with HTML, CSS, JavaScript, and React.",
    description:
      "A practical path through the fundamentals behind modern product interfaces. You will move from markup and styling basics into component thinking, interface state, and a small assessment.",
    category: "Frontend",
    level: "Beginner",
    language: "English",
    durationMinutes: 245,
    ratingDemo: 4.8,
    learnerCountDemo: 1840,
    updatedAt: "2026-06-14",
    featured: true,
    thumbnail: { accent: "indigo", label: "FE" },
    instructor: {
      name: "Mira Kapoor",
      title: "Senior Frontend Mentor",
      bio: "Mira designs accessible interfaces and coaches early-career engineers on production UI habits. Instructor details are demo content.",
    },
    outcomes: [
      "Structure semantic pages that read well on every device.",
      "Use CSS layout patterns without fighting the browser.",
      "Model interactive React screens around clear state changes.",
      "Evaluate simple interface decisions for accessibility and performance.",
    ],
    requirements: [
      "Comfort using a browser and text editor.",
      "No prior React experience required.",
      "A willingness to pause lessons and practice in small increments.",
    ],
    sections: [
      {
        id: "frontend-section-orientation",
        title: "Orientation",
        summary: "Set expectations and learn how the course workspace is organized.",
        lessons: [
          {
            id: "front-orientation",
            title: "How to use this course",
            description:
              "A brief orientation to the course flow, notes, resources, and completion behavior.",
            durationMinutes: 8,
            kind: "reading",
            resources: lessonResources,
            transcript: [
              "Use the curriculum panel to move between lessons.",
              "Mark a lesson complete when you are ready to count it toward course progress.",
              "The prototype stores progress locally and does not track exact video playback.",
            ],
          },
          {
            id: "html-crash-course",
            title: "HTML structure for useful pages",
            description:
              "A public sample lesson on semantic HTML and practical page structure.",
            durationMinutes: 58,
            kind: "video",
            isPreview: true,
            video: {
              youtubeId: "UB1O30fR-EE",
              title: "HTML Crash Course For Absolute Beginners",
            },
            resources: lessonResources,
            transcript: [
              "HTML gives a page structure before visual styling begins.",
              "Headings, links, images, and sections carry meaning for assistive technology.",
              "Good markup makes later styling and behavior easier to reason about.",
            ],
          },
        ],
      },
      {
        id: "frontend-section-core",
        title: "Core Interface Skills",
        summary: "Move from layout fundamentals into JavaScript and component state.",
        lessons: [
          {
            id: "css-layout-systems",
            title: "Layout systems without guesswork",
            description:
              "A compact reading lesson on choosing flex, grid, and spacing rules intentionally.",
            durationMinutes: 22,
            kind: "reading",
            resources: lessonResources,
            transcript: [
              "Stable dimensions reduce layout shift and make interfaces feel deliberate.",
              "Use grids for two-dimensional layout and flexbox for one-dimensional alignment.",
              "Spacing tokens keep rhythm consistent across repeated views.",
            ],
          },
          {
            id: "javascript-basics",
            title: "JavaScript behaviors for learners",
            description:
              "A public sample lesson covering the JavaScript basics behind interface behavior.",
            durationMinutes: 64,
            kind: "video",
            video: {
              youtubeId: "W6NZfCO5SIk",
              title: "JavaScript Tutorial for Beginners",
            },
            resources: lessonResources,
            transcript: [
              "JavaScript lets an interface respond to user intent.",
              "Small functions should have clear inputs and outputs.",
              "Local state belongs close to the interaction it supports.",
            ],
          },
          {
            id: "react-component-thinking",
            title: "React component thinking",
            description:
              "A public sample lesson introducing React components, props, and state.",
            durationMinutes: 78,
            kind: "video",
            video: {
              youtubeId: "SqcY0GlETPk",
              title: "React Tutorial for Beginners",
            },
            resources: lessonResources,
            transcript: [
              "A component should own one understandable part of the screen.",
              "Props describe what a component receives; state describes what changes inside it.",
              "Clear component boundaries make product interfaces easier to test.",
            ],
          },
        ],
      },
      {
        id: "frontend-section-assessment",
        title: "Checkpoint",
        summary: "Review the essentials and unlock the final reflection.",
        lessons: [
          {
            id: "frontend-checkpoint",
            title: "Frontend foundations quiz",
            description:
              "A short quiz that checks core ideas from the course. Passing it marks the checkpoint complete.",
            durationMinutes: 10,
            kind: "quiz",
            quizId: "quiz-frontend-foundations",
            resources: [],
            transcript: [
              "The quiz is local demo content.",
              "You can retake it and your latest attempt is stored in this browser.",
            ],
          },
          {
            id: "frontend-reflection",
            title: "Final reflection and next steps",
            description:
              "Plan a small portfolio-ready practice interface and identify your next learning step.",
            durationMinutes: 5,
            kind: "project",
            unlockAfterLessonId: "frontend-checkpoint",
            resources: [
              {
                id: "resource-reflection",
                title: "Reflection worksheet",
                kind: "download",
                href: "/resources/reflection-worksheet.txt",
                description: "A one-page reflection prompt for the end of a course.",
              },
            ],
            transcript: [
              "Pick a tiny interface you can finish in one sitting.",
              "Write down the tradeoffs you made and what you would improve next.",
            ],
          },
        ],
      },
    ],
    reviews: [
      {
        id: "review-frontend-1",
        learner: "Demo learner A",
        rating: 5,
        quote: "The course made the connection between layout, state, and accessibility much clearer.",
      },
      {
        id: "review-frontend-2",
        learner: "Demo learner B",
        rating: 4,
        quote: "The checkpoint helped me find gaps before moving into larger React work.",
      },
    ],
    faq: [
      {
        question: "Does this course track exact YouTube playback progress?",
        answer:
          "No. This prototype stores lesson completion and last-opened lesson only, because it does not integrate the YouTube IFrame API.",
      },
      {
        question: "Can I reset the demo progress?",
        answer: "Yes. Use the data reset action in Profile to restore the local demo state.",
      },
    ],
  },
  {
    id: "design-systems-primer",
    title: "Design Systems Primer",
    tagline: "Turn reusable interface decisions into a dependable product language.",
    description:
      "Learn the foundations of tokens, components, accessibility states, and documentation for small product teams.",
    category: "Design Systems",
    level: "Intermediate",
    language: "English",
    durationMinutes: 180,
    ratingDemo: 4.7,
    learnerCountDemo: 920,
    updatedAt: "2026-05-28",
    thumbnail: { accent: "teal", label: "DS" },
    instructor: {
      name: "Ishan Rao",
      title: "Product Design Systems Lead",
      bio: "Ishan helps teams connect design intent to resilient frontend implementation. Instructor details are demo content.",
    },
    outcomes: [
      "Create token names that map to product decisions.",
      "Document component states clearly.",
      "Audit common controls for accessibility gaps.",
      "Plan a gradual design-system rollout.",
    ],
    requirements: ["Basic UI design vocabulary.", "Some exposure to product screens."],
    sections: [
      {
        id: "systems-section-1",
        title: "System Foundations",
        summary: "Name the decisions that should become reusable.",
        lessons: [
          {
            id: "systems-token-language",
            title: "Token language that teams can share",
            description: "A practical reading on naming colors, spacing, radius, and motion tokens.",
            durationMinutes: 24,
            kind: "reading",
            resources: lessonResources,
            transcript: [
              "Tokens should describe intent, not one-off visual values.",
              "A good system makes the common path easier than local improvisation.",
            ],
          },
          {
            id: "systems-component-states",
            title: "Component states and responsibility",
            description:
              "Learn how hover, focus, selected, loading, disabled, and error states fit together.",
            durationMinutes: 31,
            kind: "reading",
            resources: lessonResources,
            transcript: [
              "States are part of the component contract.",
              "Documenting states helps engineering and QA share the same expectations.",
            ],
          },
        ],
      },
      {
        id: "systems-section-2",
        title: "Practice",
        summary: "Apply the system to a compact product workflow.",
        lessons: [
          {
            id: "systems-audit",
            title: "Audit a product flow",
            description: "A project-style lesson for mapping repeated interface decisions.",
            durationMinutes: 42,
            kind: "project",
            resources: [
              {
                id: "resource-audit-sheet",
                title: "Component audit sheet",
                kind: "download",
                href: "/resources/component-audit-sheet.txt",
                description: "A lightweight worksheet for interface audits.",
              },
            ],
            transcript: [
              "Choose one repeated workflow and list every recurring component.",
              "Look for mismatched labels, spacing, focus behavior, and error treatment.",
            ],
          },
          {
            id: "systems-checkpoint",
            title: "Design systems checkpoint",
            description: "A short quiz covering system foundations.",
            durationMinutes: 9,
            kind: "quiz",
            quizId: "quiz-design-systems",
            resources: [],
            transcript: ["Answer each question, then review the feedback before moving on."],
          },
        ],
      },
    ],
    reviews: [
      {
        id: "review-systems-1",
        learner: "Demo learner C",
        rating: 5,
        quote: "The audit lesson gave me a concrete way to start improving inconsistent screens.",
      },
    ],
    faq: [
      {
        question: "Is this a full design system build?",
        answer: "No. It is a primer focused on practical foundations for a frontend internship prototype.",
      },
    ],
  },
  {
    id: "data-storytelling",
    title: "Data Storytelling for Product Teams",
    tagline: "Turn metrics into honest, useful narratives for product decisions.",
    description:
      "Practice interpreting charts, choosing clearer labels, and writing takeaways that help teams decide what to do next.",
    category: "Analytics",
    level: "Beginner",
    language: "English",
    durationMinutes: 135,
    ratingDemo: 4.6,
    learnerCountDemo: 760,
    updatedAt: "2026-04-30",
    thumbnail: { accent: "blue", label: "DA" },
    instructor: {
      name: "Leah Menon",
      title: "Product Analytics Coach",
      bio: "Leah teaches product teams how to communicate metrics responsibly. Instructor details are demo content.",
    },
    outcomes: [
      "Choose chart types that match the question.",
      "Write concise takeaways without overstating certainty.",
      "Spot common dashboard interpretation mistakes.",
    ],
    requirements: ["Comfort reading basic charts.", "No advanced statistics required."],
    sections: [
      {
        id: "data-section-1",
        title: "Reading Metrics",
        summary: "Build the habit of asking better product questions.",
        lessons: [
          {
            id: "data-question-first",
            title: "Start with the decision",
            description: "Frame data work around the decision it needs to support.",
            durationMinutes: 18,
            kind: "reading",
            resources: lessonResources,
            transcript: [
              "A metric without a decision often becomes decoration.",
              "Clear questions reduce the temptation to overfit a story.",
            ],
          },
          {
            id: "data-chart-choices",
            title: "Choose a chart with intent",
            description: "Match chart forms to comparisons, trends, and composition.",
            durationMinutes: 28,
            kind: "reading",
            resources: lessonResources,
            transcript: [
              "Bar charts support comparison.",
              "Line charts support change over time.",
              "Annotations should clarify, not rescue unclear charts.",
            ],
          },
        ],
      },
    ],
    reviews: [
      {
        id: "review-data-1",
        learner: "Demo learner D",
        rating: 4,
        quote: "Helpful for making analytics summaries shorter and more grounded.",
      },
    ],
    faq: [
      {
        question: "Does this course use real company analytics?",
        answer: "No. All examples and learner counts are demo content.",
      },
    ],
  },
  {
    id: "ux-research-sprints",
    title: "UX Research Sprints",
    tagline: "Plan lightweight research loops without slowing the team down.",
    description:
      "A concise course on setting research goals, writing interview prompts, and turning findings into product decisions.",
    category: "Product Design",
    level: "Intermediate",
    language: "English",
    durationMinutes: 160,
    ratingDemo: 4.9,
    learnerCountDemo: 1180,
    updatedAt: "2026-06-04",
    thumbnail: { accent: "violet", label: "UX" },
    instructor: {
      name: "Nadia Shah",
      title: "UX Research Partner",
      bio: "Nadia works with product teams on practical research planning. Instructor details are demo content.",
    },
    outcomes: [
      "Write research questions that fit a sprint.",
      "Prepare interview guides without leading participants.",
      "Synthesize observations into practical next steps.",
    ],
    requirements: ["Some exposure to product discovery is useful but not required."],
    sections: [
      {
        id: "research-section-1",
        title: "Sprint Setup",
        summary: "Set the scope before speaking to users.",
        lessons: [
          {
            id: "research-question",
            title: "Write a useful research question",
            description: "Separate what the team wants to know from what it hopes is true.",
            durationMinutes: 21,
            kind: "reading",
            resources: lessonResources,
            transcript: [
              "A good research question leaves room to be surprised.",
              "Sprint research works best when it narrows uncertainty for one decision.",
            ],
          },
          {
            id: "research-interview-guide",
            title: "Build an interview guide",
            description: "Create prompts that reduce bias and keep the conversation useful.",
            durationMinutes: 34,
            kind: "project",
            resources: [
              {
                id: "resource-interview-guide",
                title: "Interview guide template",
                kind: "download",
                href: "/resources/interview-guide-template.txt",
                description: "A safe local template for planning a short interview.",
              },
            ],
            transcript: [
              "Ask about recent behavior before asking for opinions.",
              "Keep prompts simple and avoid teaching participants your preferred answer.",
            ],
          },
        ],
      },
    ],
    reviews: [
      {
        id: "review-research-1",
        learner: "Demo learner E",
        rating: 5,
        quote: "A focused guide for making research less intimidating during fast projects.",
      },
    ],
    faq: [
      {
        question: "Is participant recruitment included?",
        answer: "No. This prototype focuses on the learner-facing course experience.",
      },
    ],
  },
];

export const quizzes: Quiz[] = [
  {
    id: "quiz-frontend-foundations",
    courseId: "frontend-foundations",
    lessonId: "frontend-checkpoint",
    title: "Frontend foundations checkpoint",
    passingScore: 70,
    questions: [
      {
        id: "q-semantic",
        prompt: "What is the main reason to use semantic HTML elements?",
        options: [
          { id: "a", label: "They add animation to a page automatically." },
          { id: "b", label: "They communicate structure and meaning to browsers and assistive tools." },
          { id: "c", label: "They remove the need for CSS." },
        ],
        correctOptionId: "b",
        feedback: "Semantic HTML improves structure, navigation, and accessibility.",
      },
      {
        id: "q-layout",
        prompt: "Which layout choice is usually better for two-dimensional page regions?",
        options: [
          { id: "a", label: "CSS Grid" },
          { id: "b", label: "Only margin-left values" },
          { id: "c", label: "Inline styles on every element" },
        ],
        correctOptionId: "a",
        feedback: "Grid is designed for rows and columns together.",
      },
      {
        id: "q-state",
        prompt: "In React, what should local component state describe?",
        options: [
          { id: "a", label: "Values that change because of user interaction or UI events." },
          { id: "b", label: "Static course descriptions copied from fixtures." },
          { id: "c", label: "Every design token in the app." },
        ],
        correctOptionId: "a",
        feedback: "State should represent meaningful changes inside a component or flow.",
      },
    ],
  },
  {
    id: "quiz-design-systems",
    courseId: "design-systems-primer",
    lessonId: "systems-checkpoint",
    title: "Design systems checkpoint",
    passingScore: 70,
    questions: [
      {
        id: "q-token",
        prompt: "What makes a token name useful?",
        options: [
          { id: "a", label: "It describes intent that can survive visual changes." },
          { id: "b", label: "It includes the exact current hex value." },
          { id: "c", label: "It is different in every component." },
        ],
        correctOptionId: "a",
        feedback: "Intent-based token names keep the system adaptable.",
      },
      {
        id: "q-states",
        prompt: "Why document component states?",
        options: [
          { id: "a", label: "To make QA and engineering expectations explicit." },
          { id: "b", label: "To avoid building keyboard focus behavior." },
          { id: "c", label: "To replace user testing." },
        ],
        correctOptionId: "a",
        feedback: "States are part of the component contract.",
      },
    ],
  },
];

export const courseCategories = Array.from(new Set(courses.map((course) => course.category)));

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getLesson(course: Course, lessonId: string) {
  return course.sections.flatMap((section) => section.lessons).find((lesson) => lesson.id === lessonId);
}

export function getQuiz(quizId: string) {
  return quizzes.find((quiz) => quiz.id === quizId);
}
