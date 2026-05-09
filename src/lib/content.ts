export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: "Habits" | "Focus" | "Recovery";
  publishedAt: string;
  keywords: string[];
  body: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export type SeoLandingPage = {
  slug:
    | "forgiving-habit-tracker"
    | "habit-tracker-no-streak"
    | "focus-session-app"
    | "website-blocker-for-deep-work"
    | "habit-tracker-adhd";
  title: string;
  description: string;
  eyebrow: string;
  hero: string;
  summary: string;
  bullets: string[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "forgiving-habit-tracker",
    title: "Forgiving Habit Tracker",
    description:
      "A forgiving habit tracker that replaces streak shame with momentum, restarts, and quick daily recovery.",
    eyebrow: "Recovery-first habits",
    hero: "Restart your routine without turning one miss into a collapse.",
    summary:
      "Traditional streak apps treat a miss like failure. Forging Habit keeps the signal that matters: how quickly you return.",
    bullets: [
      "Momentum replaces brittle streak psychology.",
      "Missed days trigger restart prompts instead of guilt-heavy failure states.",
      "Focus sessions can reinforce the exact habit you are trying to rebuild.",
    ],
  },
  {
    slug: "habit-tracker-no-streak",
    title: "Habit Tracker Without Streak Pressure",
    description:
      "Track habits without streak pressure. Use momentum summaries, restart prompts, and calm weekly cadence support.",
    eyebrow: "No streak guilt",
    hero: "If streaks make you quit, stop designing your habits around streaks.",
    summary:
      "This app is built for people who do not need more pressure. It keeps momentum visible while making restarts immediate.",
    bullets: [
      "Daily and weekly habit cadences both support missed-day recovery.",
      "Dashboard copy is tuned for quick re-entry, not punishment.",
      "Free tier is enough to test the system without a commitment leap.",
    ],
  },
  {
    slug: "focus-session-app",
    title: "Focus Session App With Commitment Mode",
    description:
      "Run structured focus blocks with countdowns, linked habits, and a browser extension that blocks distraction sites.",
    eyebrow: "Commitment-grade focus",
    hero: "Start a focus block that means something because it protects the work.",
    summary:
      "Forging Habit combines a timer, an intention label, and a blocking layer so sessions feel like commitments instead of suggestions.",
    bullets: [
      "Preset durations keep session start friction low.",
      "Linked habits connect focused work back to routine recovery.",
      "Strict mode is available on Pro when you do not want easy overrides.",
    ],
  },
  {
    slug: "website-blocker-for-deep-work",
    title: "Website Blocker For Deep Work",
    description:
      "A website blocker for deep work with personal blocklists, active-session syncing, and override friction when needed.",
    eyebrow: "Deep work protection",
    hero: "Block the sites you always drift toward while a focus block is active.",
    summary:
      "The Chrome extension reads your current focus session from the web app and turns your blocklist into an active commitment.",
    bullets: [
      "Free users get up to three blocked domains and a friction-delay override.",
      "Pro removes the domain cap and supports stricter commitment behavior.",
      "The blocking state is tied to a real session, not a vague always-on filter.",
    ],
  },
  {
    slug: "habit-tracker-adhd",
    title: "ADHD-Friendly Habit Tracker",
    description:
      "An ADHD-friendly habit tracker built around restart speed, low friction, and momentum instead of shame-heavy streaks.",
    eyebrow: "Built for inconsistent brains",
    hero: "Support routines with less self-judgment and stronger restart mechanics.",
    summary:
      "For many ADHD-adjacent users, streak loss means abandonment. Forging Habit treats breaks as part of the system and helps you begin again quickly.",
    bullets: [
      "Starter habits reduce setup paralysis during onboarding.",
      "Recovery prompts log why routines slipped so patterns become visible.",
      "Focus blocks help protect the exact windows where distraction usually wins.",
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-restart-a-habit-after-missing-a-day",
    title: "How To Restart a Habit After Missing a Day",
    description:
      "A practical recovery flow for getting back into a habit after a miss without spiraling into all-or-nothing thinking.",
    category: "Recovery",
    publishedAt: "2026-05-01",
    keywords: ["restart habit tracker", "how to restart habits after missing a day"],
    body: [
      {
        heading: "Treat the miss as information, not proof",
        paragraphs: [
          "When a routine slips, the useful question is not whether you failed. It is what changed in the environment, energy, or structure around the habit.",
          "That is why Forging Habit stores a short restart reason. Naming the interruption keeps you in problem-solving mode instead of guilt mode.",
        ],
      },
      {
        heading: "Restart on the smallest credible version",
        paragraphs: [
          "The best restart is usually lighter than your ideal plan. A tiny credible version rebuilds trust faster than an ambitious make-up effort.",
          "Momentum grows from returns, not from punishing yourself for absence.",
        ],
      },
    ],
  },
  {
    slug: "why-streaks-make-some-people-quit",
    title: "Why Streaks Make Some People Quit",
    description:
      "Streaks work for some users, but for others they create collapse after a single miss. Here is why momentum is a better signal.",
    category: "Habits",
    publishedAt: "2026-05-02",
    keywords: ["habit tracker no streak", "why streak apps make some people quit"],
    body: [
      {
        heading: "Streaks turn one bad day into a system reset",
        paragraphs: [
          "A streak can feel motivating right up until it becomes fragile identity. Then one miss becomes emotionally expensive.",
          "Users who already struggle with inconsistency often interpret the reset as evidence that the whole system is broken.",
        ],
      },
      {
        heading: "Momentum gives you a recovery target instead",
        paragraphs: [
          "A momentum model asks how often you are returning over time. That metric survives imperfect weeks much better than a binary streak count.",
        ],
      },
    ],
  },
  {
    slug: "best-habit-trackers-for-adhd-adults",
    title: "Best Habit Trackers for ADHD Adults",
    description:
      "What matters most in a habit tracker for ADHD adults: low friction, recovery flows, and systems that do not punish interruptions.",
    category: "Habits",
    publishedAt: "2026-05-03",
    keywords: ["habit tracker for ADHD adults", "ADHD habit tracker"],
    body: [
      {
        heading: "Lower friction beats higher ambition",
        paragraphs: [
          "The app has to make return friction tiny. Setup speed, daily clarity, and low emotional overhead matter more than elaborate analytics.",
        ],
      },
      {
        heading: "Compassion is only useful if it leads to action",
        paragraphs: [
          "A kind tone helps, but the app still needs concrete tools: restart prompts, simple logging, and focused work protection.",
        ],
      },
    ],
  },
  {
    slug: "how-to-recover-momentum-after-burnout",
    title: "How To Recover Momentum After Burnout",
    description:
      "Use scaled-down expectations, restart logging, and short protected focus blocks to recover momentum after burnout.",
    category: "Recovery",
    publishedAt: "2026-05-04",
    keywords: ["recover momentum after burnout", "momentum habit app"],
    body: [
      {
        heading: "Reduce the target before you judge the result",
        paragraphs: [
          "After burnout, old baselines are often invalid. A calmer target lets you practice showing up without reenacting the old pressure cycle.",
        ],
      },
      {
        heading: "Protect one block at a time",
        paragraphs: [
          "Short focus sessions can restore confidence because they make the next piece of work legible and bounded.",
        ],
      },
    ],
  },
  {
    slug: "focus-blockers-that-are-harder-to-override",
    title: "Focus Blockers That Are Harder To Override",
    description:
      "Why easy overrides defeat focus blockers, and how session-linked blocking creates stronger commitment.",
    category: "Focus",
    publishedAt: "2026-05-05",
    keywords: ["app blocker that actually works", "focus blocker override"],
    body: [
      {
        heading: "The blocker has to outlast the impulse",
        paragraphs: [
          "If the override path is instant, the blocker becomes ceremonial. It needs enough friction to survive the exact moment you want to break the rule.",
        ],
      },
      {
        heading: "Linking blocking to a live session changes the psychology",
        paragraphs: [
          "A session gives the blocker a clear end time and a reason. That makes commitment mode feel more legitimate than an always-on restriction.",
        ],
      },
    ],
  },
  {
    slug: "how-to-stop-opening-reddit-during-work",
    title: "How To Stop Opening Reddit During Work",
    description:
      "A practical method for stopping reflexive Reddit opens during work using blocklists, focus labels, and session boundaries.",
    category: "Focus",
    publishedAt: "2026-05-06",
    keywords: ["how to stop opening reddit during work", "website blocker for deep work"],
    body: [
      {
        heading: "Target the reflex sites directly",
        paragraphs: [
          "The right blocklist is personal. It usually includes only the few sites that repeatedly steal attention, not the entire internet.",
        ],
      },
      {
        heading: "Name the work before you block distractions",
        paragraphs: [
          "A focus label like 'write draft' or 'prepare slides' helps your brain accept the trade you are making.",
        ],
      },
    ],
  },
  {
    slug: "habit-systems-for-inconsistent-people",
    title: "Habit Systems for Inconsistent People",
    description:
      "A habit system for inconsistent people should optimize for return speed, not perfection theater.",
    category: "Habits",
    publishedAt: "2026-05-07",
    keywords: ["habit systems for inconsistent people", "forgiving habit tracker"],
    body: [
      {
        heading: "Inconsistency is a design constraint",
        paragraphs: [
          "If you know interruptions happen, the system has to assume they will happen and help you recover from them by default.",
        ],
      },
      {
        heading: "Keep the daily screen brutally simple",
        paragraphs: [
          "A clean dashboard lowers resistance. Users should see their habits, current momentum, active session, and any restart prompt immediately.",
        ],
      },
    ],
  },
  {
    slug: "why-never-miss-twice-still-fails-some-users",
    title: "Why 'Never Miss Twice' Still Fails Some Users",
    description:
      "Never-miss-twice is useful advice, but it still assumes the main barrier is intention rather than friction, shame, or energy swings.",
    category: "Recovery",
    publishedAt: "2026-05-08",
    keywords: ["never miss twice still fails", "restart habits"],
    body: [
      {
        heading: "Good slogans can hide missing support",
        paragraphs: [
          "The phrase points in the right direction, but it does not give users a mechanism for the restart itself.",
        ],
      },
      {
        heading: "The restart needs a path",
        paragraphs: [
          "Better systems pair the idea with a one-click restart, a reason log, and a smaller next step.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getSeoLandingPage(slug: SeoLandingPage["slug"]) {
  return seoLandingPages.find((page) => page.slug === slug) ?? null;
}
