import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "app-data.json");

const now = new Date();

function id(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

function isoDaysAgo(days, hour = 15) {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

function dayKeyDaysAgo(days) {
  const date = new Date(now);
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(12, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

const demoUserId = "user_demo";

const seedData = {
  users: [
    {
      id: demoUserId,
      email: "demo@forginghabit.local",
      name: "Demo User",
      timezone: "America/New_York",
      resetHour: 5,
      rebuildGoal: "a calmer work rhythm",
      onboardingCompleted: true,
      allowEmergencyOverride: false,
      createdAt: isoDaysAgo(30),
      updatedAt: now.toISOString(),
      lastActiveAt: now.toISOString(),
    },
  ],
  sessions: [],
  loginCodes: [
    {
      id: id("code"),
      email: "demo@forginghabit.local",
      code: "111111",
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  habits: [
    {
      id: "habit_shutdown",
      userId: demoUserId,
      name: "Shutdown ritual",
      slug: "shutdown-ritual",
      cadenceType: "daily",
      targetPerWeek: null,
      category: "Work",
      isArchived: false,
      createdAt: isoDaysAgo(20),
    },
    {
      id: "habit_walk",
      userId: demoUserId,
      name: "Walk after lunch",
      slug: "walk-after-lunch",
      cadenceType: "daily",
      targetPerWeek: null,
      category: "Energy",
      isArchived: false,
      createdAt: isoDaysAgo(20),
    },
    {
      id: "habit_review",
      userId: demoUserId,
      name: "Weekly review",
      slug: "weekly-review",
      cadenceType: "weekly",
      targetPerWeek: 2,
      category: "Planning",
      isArchived: false,
      createdAt: isoDaysAgo(20),
    },
  ],
  habitCompletions: [
    ...[0, 1, 3, 4, 6].map((daysAgo) => ({
      id: id("completion"),
      habitId: "habit_shutdown",
      userId: demoUserId,
      completedOnDate: dayKeyDaysAgo(daysAgo),
      source: "manual",
      createdAt: isoDaysAgo(daysAgo),
    })),
    ...[0, 2, 3, 5].map((daysAgo) => ({
      id: id("completion"),
      habitId: "habit_walk",
      userId: demoUserId,
      completedOnDate: dayKeyDaysAgo(daysAgo),
      source: "manual",
      createdAt: isoDaysAgo(daysAgo, 18),
    })),
    ...[2, 9].map((daysAgo) => ({
      id: id("completion"),
      habitId: "habit_review",
      userId: demoUserId,
      completedOnDate: dayKeyDaysAgo(daysAgo),
      source: "manual",
      createdAt: isoDaysAgo(daysAgo, 20),
    })),
  ],
  habitLapses: [
    {
      id: "lapse_walk_recent",
      habitId: "habit_walk",
      userId: demoUserId,
      lapseDate: dayKeyDaysAgo(1),
      createdAt: isoDaysAgo(1, 12),
    },
  ],
  focusSessions: [
    {
      id: "focus_recent_complete",
      userId: demoUserId,
      habitId: "habit_shutdown",
      label: "Write project brief",
      durationMinutes: 25,
      startedAt: isoDaysAgo(2, 14),
      endsAt: isoDaysAgo(2, 14),
      completedAt: isoDaysAgo(2, 15),
      status: "completed",
      allowOverride: false,
    },
  ],
  blockedDomains: [
    {
      id: "domain_reddit",
      userId: demoUserId,
      domain: "reddit.com",
      isActive: true,
      createdAt: isoDaysAgo(7),
    },
    {
      id: "domain_youtube",
      userId: demoUserId,
      domain: "youtube.com",
      isActive: true,
      createdAt: isoDaysAgo(7),
    },
  ],
  subscriptions: [
    {
      id: "sub_demo",
      userId: demoUserId,
      plan: "pro-yearly",
      status: "active",
      currentPeriodEnd: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: isoDaysAgo(14),
      updatedAt: now.toISOString(),
    },
  ],
  extensionTokens: [
    {
      id: "token_demo",
      userId: demoUserId,
      token: "ext_demo_token",
      createdAt: isoDaysAgo(1),
    },
  ],
  analyticsEvents: [
    {
      id: id("evt"),
      userId: demoUserId,
      name: "seed_demo_loaded",
      metadata: { source: "scripts/seed-demo.mjs" },
      createdAt: now.toISOString(),
    },
  ],
  emailLogs: [
    {
      id: id("email"),
      userId: demoUserId,
      email: "demo@forginghabit.local",
      type: "welcome",
      status: "preview",
      preview: "Welcome back to your habits, Demo User. Start small and restart fast.",
      createdAt: isoDaysAgo(14),
    },
  ],
};

fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(dataFile, `${JSON.stringify(seedData, null, 2)}\n`);

console.log("Seeded demo data.");
console.log("Email: demo@forginghabit.local");
console.log("Login code: 111111");
