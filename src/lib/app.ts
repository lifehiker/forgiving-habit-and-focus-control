import { addMinutes, formatISO, subDays } from "date-fns";

import { trackEvent } from "@/lib/analytics";
import { getHabitDayKey } from "@/lib/dates";
import { sendLifecycleEmail } from "@/lib/email";
import { detectAndPersistLapses, getMomentumSummary } from "@/lib/habits/momentum";
import { mutateStore, readStore } from "@/lib/store";
import type {
  AppUser,
  BlockedDomain,
  FocusSession,
  RestartReason,
  SubscriptionPlan,
} from "@/lib/types";
import { createId, slugify } from "@/lib/utils";

export function getAppSnapshot(user: AppUser) {
  const data = readStore();
  const openLapses = detectAndPersistLapses(user.id, user.timezone, user.resetHour);
  const activeSession = getActiveFocusSession(user.id);

  return {
    habits: data.habits.filter((habit) => habit.userId === user.id && !habit.isArchived),
    completions: data.habitCompletions.filter(
      (completion) => completion.userId === user.id,
    ),
    openLapses,
    activeSession,
    blockedDomains: data.blockedDomains.filter(
      (domain) => domain.userId === user.id && domain.isActive,
    ),
    momentum: getMomentumSummary(user.id),
  };
}

export function getActiveFocusSession(userId: string): FocusSession | null {
  const { activeSession, changed } = mutateStore((data) => {
    let changed = false;
    for (const session of data.focusSessions) {
      if (
        session.userId === userId &&
        session.status === "active" &&
        new Date(session.endsAt) <= new Date()
      ) {
        session.status = "expired";
        session.completedAt = new Date().toISOString();
        changed = true;
      }
    }

    return {
      changed,
      activeSession:
        data.focusSessions.find(
          (session) =>
            session.userId === userId &&
            session.status === "active" &&
            new Date(session.endsAt) > new Date(),
        ) ?? null,
    };
  });
  if (changed) {
    trackEvent("focus_session_completed", userId, { autoExpired: true });
  }
  return activeSession;
}

export function getHistoryEvents(userId: string) {
  const data = readStore();

  const habitEvents = data.habitCompletions
    .filter((completion) => completion.userId === userId)
    .map((completion) => ({
      id: completion.id,
      type: "habit" as const,
      title: "Habit completed",
      date: completion.createdAt,
      detail: data.habits.find((habit) => habit.id === completion.habitId)?.name ?? "Habit",
    }));

  const lapseEvents = data.habitLapses
    .filter((lapse) => lapse.userId === userId)
    .flatMap((lapse) => {
      const habitName =
        data.habits.find((habit) => habit.id === lapse.habitId)?.name ?? "Habit";
      const base = [
        {
          id: `${lapse.id}-lapse`,
          type: "lapse" as const,
          title: "Lapse detected",
          date: lapse.createdAt,
          detail: `${habitName} missed on ${lapse.lapseDate}`,
        },
      ];

      if (lapse.restartDate) {
        base.push({
          id: `${lapse.id}-restart`,
          type: "lapse" as const,
          title: "Restart logged",
          date: lapse.restartDate,
          detail: `${habitName} restarted with reason: ${lapse.restartReason}`,
        });
      }

      return base;
    });

  const focusEvents = data.focusSessions
    .filter((session) => session.userId === userId)
    .map((session) => ({
      id: session.id,
      type: "focus" as const,
      title:
        session.status === "completed" || session.status === "expired"
          ? "Focus session finished"
          : "Focus session started",
      date: session.completedAt ?? session.startedAt,
      detail: `${session.label} · ${session.durationMinutes} minutes`,
    }));

  return [...habitEvents, ...lapseEvents, ...focusEvents].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function enforceHabitLimit(user: AppUser) {
  if (user.subscription.plan !== "free") return;
  const activeHabits = readStore().habits.filter(
    (habit) => habit.userId === user.id && !habit.isArchived,
  ).length;
  if (activeHabits >= 3) {
    throw new Error("Free plan users can keep up to 3 active habits.");
  }
}

export function enforceFocusLimit(user: AppUser) {
  if (user.subscription.plan !== "free") return;
  const since = subDays(new Date(), 7);
  const recentSessions = readStore().focusSessions.filter(
    (session) => session.userId === user.id && new Date(session.startedAt) >= since,
  ).length;
  if (recentSessions >= 5) {
    throw new Error("Free plan users can start up to 5 focus sessions every 7 days.");
  }
}

export function enforceBlocklistLimit(user: AppUser) {
  if (user.subscription.plan !== "free") return;
  const activeDomains = readStore().blockedDomains.filter(
    (domain) => domain.userId === user.id && domain.isActive,
  ).length;
  if (activeDomains >= 3) {
    throw new Error("Free plan users can block up to 3 domains.");
  }
}

export function createHabit(user: AppUser, input: {
  name: string;
  cadenceType: "daily" | "weekly";
  targetPerWeek?: number;
  category: string;
}) {
  enforceHabitLimit(user);
  mutateStore((data) => {
    data.habits.push({
      id: createId("habit"),
      userId: user.id,
      name: input.name,
      slug: slugify(input.name),
      cadenceType: input.cadenceType,
      targetPerWeek: input.cadenceType === "weekly" ? input.targetPerWeek ?? 3 : null,
      category: input.category,
      isArchived: false,
      createdAt: new Date().toISOString(),
    });
    markUserActiveInStore(data, user.id);
  });
  trackEvent("habit_created", user.id, { cadence: input.cadenceType });
}

export function completeHabit(user: AppUser, habitId: string, source: "manual" | "focus-session") {
  const today = getHabitDayKey(new Date(), user.timezone, user.resetHour);
  mutateStore((data) => {
    const exists = data.habitCompletions.some(
      (completion) =>
        completion.userId === user.id &&
        completion.habitId === habitId &&
        completion.completedOnDate.slice(0, 10) === today,
    );
    if (!exists) {
      data.habitCompletions.push({
        id: createId("completion"),
        habitId,
        userId: user.id,
        completedOnDate: today,
        source,
        createdAt: new Date().toISOString(),
      });
    }
    markUserActiveInStore(data, user.id);
  });
  trackEvent("habit_completed", user.id, { source });
}

export function archiveHabit(userId: string, habitId: string) {
  mutateStore((data) => {
    const habit = data.habits.find((entry) => entry.id === habitId && entry.userId === userId);
    if (habit) {
      habit.isArchived = true;
    }
    markUserActiveInStore(data, userId);
  });
}

export function restartHabit(userId: string, habitId: string, restartReason: RestartReason) {
  mutateStore((data) => {
    const latestOpenLapse = [...data.habitLapses]
      .reverse()
      .find(
        (lapse) =>
          lapse.userId === userId && lapse.habitId === habitId && !lapse.restartDate,
      );
    if (latestOpenLapse) {
      latestOpenLapse.restartDate = new Date().toISOString();
      latestOpenLapse.restartReason = restartReason;
    }
    markUserActiveInStore(data, userId);
  });
  trackEvent("restart_clicked", userId, { restartReason });
}

export function startFocusSession(
  user: AppUser,
  input: { label: string; durationMinutes: number; habitId?: string },
) {
  const existingActiveSession = getActiveFocusSession(user.id);
  if (existingActiveSession) {
    throw new Error("Finish your current focus session before starting another one.");
  }

  enforceFocusLimit(user);
  if (input.habitId && user.subscription.plan === "free") {
    throw new Error("Linked habit sessions are part of Pro.");
  }

  mutateStore((data) => {
    data.focusSessions.push({
      id: createId("focus"),
      userId: user.id,
      habitId: input.habitId,
      label: input.label,
      durationMinutes: input.durationMinutes,
      startedAt: new Date().toISOString(),
      endsAt: addMinutes(new Date(), input.durationMinutes).toISOString(),
      status: "active",
      allowOverride: user.subscription.plan === "free" ? true : user.allowEmergencyOverride,
    });
    markUserActiveInStore(data, user.id);
  });
  trackEvent("focus_session_started", user.id, {
    durationMinutes: input.durationMinutes,
  });
}

export function finishFocusSession(user: AppUser, sessionId: string) {
  let linkedHabitId: string | undefined;
  mutateStore((data) => {
    const session = data.focusSessions.find(
      (entry) => entry.id === sessionId && entry.userId === user.id,
    );
    if (!session) return;
    session.status = "completed";
    session.completedAt = new Date().toISOString();
    linkedHabitId = session.habitId;
    markUserActiveInStore(data, user.id);
  });
  if (linkedHabitId) {
    completeHabit(user, linkedHabitId, "focus-session");
  }
  trackEvent("focus_session_completed", user.id);
}

export function addBlockedDomain(user: AppUser, domain: string) {
  enforceBlocklistLimit(user);
  mutateStore((data) => {
    const existing = data.blockedDomains.find(
      (entry) => entry.userId === user.id && entry.domain === domain && entry.isActive,
    );
    if (existing) {
      markUserActiveInStore(data, user.id);
      return;
    }
    data.blockedDomains.push({
      id: createId("domain"),
      userId: user.id,
      domain,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    markUserActiveInStore(data, user.id);
  });
}

export function removeBlockedDomain(userId: string, domainId: string) {
  mutateStore((data) => {
    const domain = data.blockedDomains.find(
      (entry) => entry.id === domainId && entry.userId === userId,
    );
    if (domain) {
      domain.isActive = false;
    }
    markUserActiveInStore(data, userId);
  });
}

export function generateExtensionToken(userId: string) {
  const token = createId("ext");
  mutateStore((data) => {
    data.extensionTokens = data.extensionTokens.filter((entry) => entry.userId !== userId);
    data.extensionTokens.push({
      id: createId("token"),
      userId,
      token,
      createdAt: new Date().toISOString(),
    });
    markUserActiveInStore(data, userId);
  });
  trackEvent("extension_token_created", userId);
  return token;
}

export function validateExtensionToken(token: string) {
  const data = readStore();
  const existing = data.extensionTokens.find((entry) => entry.token === token);
  if (!existing) return null;

  mutateStore((mutable) => {
    const match = mutable.extensionTokens.find((entry) => entry.token === token);
    if (match) {
      match.lastUsedAt = new Date().toISOString();
    }
  });

  return existing.userId;
}

export function updateProfile(
  userId: string,
  input: Partial<Pick<AppUser, "name" | "timezone" | "resetHour" | "allowEmergencyOverride">>,
) {
  mutateStore((data) => {
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return;
    if (input.name !== undefined) user.name = input.name;
    if (input.timezone !== undefined) user.timezone = input.timezone;
    if (input.resetHour !== undefined) user.resetHour = input.resetHour;
    if (input.allowEmergencyOverride !== undefined) {
      user.allowEmergencyOverride = input.allowEmergencyOverride;
    }
    user.updatedAt = new Date().toISOString();
    user.lastActiveAt = new Date().toISOString();
  });
}

export function completeOnboarding(
  userId: string,
  input: {
    rebuildGoal: string;
    timezone: string;
    resetHour: number;
    starterHabits: Array<{
      name: string;
      cadenceType: "daily" | "weekly";
      targetPerWeek: number | null;
      category: string;
    }>;
  },
) {
  const data = readStore();
  const subscription =
    data.subscriptions.find((entry) => entry.userId === userId)?.plan ?? "free";
  const existingHabitNames = new Set(
    data.habits.filter((habit) => habit.userId === userId && !habit.isArchived).map((habit) => habit.name),
  );
  const requestedHabitNames = new Set(input.starterHabits.map((habit) => habit.name));

  if (subscription === "free" && existingHabitNames.size + requestedHabitNames.size > 3) {
    throw new Error("Free plan onboarding is limited to 3 active habits. Pick up to 3 to continue.");
  }

  mutateStore((data) => {
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return;
    user.rebuildGoal = input.rebuildGoal;
    user.timezone = input.timezone;
    user.resetHour = input.resetHour;
    user.onboardingCompleted = true;
    user.updatedAt = new Date().toISOString();
    user.lastActiveAt = new Date().toISOString();

    const existingHabitNames = new Set(
      data.habits.filter((habit) => habit.userId === userId).map((habit) => habit.name),
    );

    for (const habit of input.starterHabits) {
      if (!existingHabitNames.has(habit.name)) {
        data.habits.push({
          id: createId("habit"),
          userId,
          name: habit.name,
          slug: slugify(habit.name),
          cadenceType: habit.cadenceType,
          targetPerWeek: habit.targetPerWeek,
          category: habit.category,
          isArchived: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  });

  trackEvent("onboarding_completed", userId);
}

export function maybeSendWelcomeEmail(user: AppUser) {
  const data = readStore();
  const alreadySent = data.emailLogs.some(
    (email) => email.userId === user.id && email.type === "welcome",
  );
  if (alreadySent) return;

  sendLifecycleEmail({
    userId: user.id,
    email: user.email,
    type: "welcome",
    preview: `Welcome back to your habits, ${user.name}. Start small and restart fast.`,
  });
}

export function maybeSendUpgradeEmail(userId: string, email: string, plan: SubscriptionPlan) {
  sendLifecycleEmail({
    userId,
    email,
    type: "upgrade-confirmation",
    preview: `Your ${plan} plan is active. Strict commitment mode and full history are ready.`,
  });
}

export function runRestartNudges() {
  return mutateStore((data) => {
    const sentTo: string[] = [];

    for (const user of data.users) {
      const lastCompletion = data.habitCompletions
        .filter((completion) => completion.userId === user.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      const lastSession = data.focusSessions
        .filter((session) => session.userId === user.id)
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
      const lastActivity = [lastCompletion?.createdAt, lastSession?.startedAt, user.lastActiveAt]
        .filter(Boolean)
        .sort()
        .pop();

      if (!lastActivity) continue;

      const inactive = new Date(lastActivity) < subDays(new Date(), 3);
      const alreadySentRecently =
        user.lastRestartNudgeAt && new Date(user.lastRestartNudgeAt) > subDays(new Date(), 7);

      if (inactive && !alreadySentRecently) {
        user.lastRestartNudgeAt = new Date().toISOString();
        sendLifecycleEmail({
          userId: user.id,
          email: user.email,
          type: "restart-nudge",
          preview: "You can restart today. We saved the next step for you.",
        });
        sentTo.push(user.email);
      }
    }

    return sentTo;
  });
}

export function getTodayHabitStatus(userId: string) {
  const snapshot = readStore();
  const user = snapshot.users.find((entry) => entry.id === userId);
  if (!user) return [];
  const today = getHabitDayKey(new Date(), user.timezone, user.resetHour);
  return snapshot.habits
    .filter((habit) => habit.userId === userId && !habit.isArchived)
    .map((habit) => ({
      ...habit,
      isComplete: snapshot.habitCompletions.some(
        (completion) =>
          completion.habitId === habit.id &&
          completion.userId === userId &&
          completion.completedOnDate.slice(0, 10) === today,
      ),
    }));
}

function markUserActiveInStore(
  data: ReturnType<typeof readStore>,
  userId: string,
) {
  const user = data.users.find((entry) => entry.id === userId);
  if (!user) return;
  user.lastActiveAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
}

export function getExtensionPayload(userId: string) {
  const user = readStore().users.find((entry) => entry.id === userId);
  if (!user) return null;
  const subscription = readStore().subscriptions.find(
    (entry) => entry.userId === userId,
  );
  const activeSession = getActiveFocusSession(userId);
  const blockedDomains = readStore().blockedDomains.filter(
    (domain) => domain.userId === userId && domain.isActive,
  );

  return {
    session: activeSession
      ? {
          id: activeSession.id,
          label: activeSession.label,
          endsAt: activeSession.endsAt,
          startedAt: activeSession.startedAt,
          strictMode: subscription?.plan !== "free" && !user.allowEmergencyOverride,
          allowOverride: activeSession.allowOverride,
        }
      : null,
    blockedDomains: blockedDomains.map((domain) => domain.domain),
  };
}

export function formatResetHourLabel(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function getCurrentRenewalLabel(user: AppUser) {
  if (!user.subscription.currentPeriodEnd) return "No active renewal";
  return formatISO(new Date(user.subscription.currentPeriodEnd), {
    representation: "date",
  });
}

export function getBlockedDomainCount(userId: string) {
  return readStore().blockedDomains.filter(
    (domain) => domain.userId === userId && domain.isActive,
  ).length;
}

export function getLatestExtensionToken(userId: string) {
  return readStore().extensionTokens.find((entry) => entry.userId === userId)?.token ?? null;
}

export function getActiveBlockedDomains(userId: string): BlockedDomain[] {
  return readStore().blockedDomains.filter(
    (domain) => domain.userId === userId && domain.isActive,
  );
}
