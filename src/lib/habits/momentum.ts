import { subDays } from "date-fns";

import { getHabitDayKey, getPreviousHabitDayKey, getPreviousHabitWeekRange } from "@/lib/dates";
import { mutateStore, readStore } from "@/lib/store";
import type { Habit, HabitLapse } from "@/lib/types";

function getHabitCreatedDate(habit: Habit) {
  return habit.createdAt.slice(0, 10);
}

export function getHabitCompletionsByWindow(userId: string, days: number) {
  const data = readStore();
  const since = subDays(new Date(), days - 1);

  return data.habitCompletions.filter(
    (completion) =>
      completion.userId === userId && new Date(completion.completedOnDate) >= since,
  );
}

export function getMomentumSummary(userId: string) {
  const last7 = new Set(
    getHabitCompletionsByWindow(userId, 7).map((completion) =>
      completion.completedOnDate.slice(0, 10),
    ),
  ).size;
  const last30 = new Set(
    getHabitCompletionsByWindow(userId, 30).map((completion) =>
      completion.completedOnDate.slice(0, 10),
    ),
  ).size;

  return {
    last7,
    last30,
    currentMomentum: Math.min(last7 + Math.round(last30 / 3), 30),
  };
}

export function detectAndPersistLapses(
  userId: string,
  timeZone: string,
  resetHour: number,
) {
  return mutateStore((data) => {
    const habits = data.habits.filter((habit) => habit.userId === userId && !habit.isArchived);
    const openLapses: HabitLapse[] = [];

    for (const habit of habits) {
      const createdDate = getHabitCreatedDate(habit);
      data.habitLapses = data.habitLapses.filter(
        (lapse) =>
          lapse.habitId !== habit.id ||
          lapse.userId !== userId ||
          lapse.lapseDate >= createdDate,
      );

      const completions = data.habitCompletions
        .filter((completion) => completion.habitId === habit.id)
        .sort((a, b) => b.completedOnDate.localeCompare(a.completedOnDate));

      if (habit.cadenceType === "daily") {
        const lapseDate = getPreviousHabitDayKey(timeZone, resetHour);
        if (lapseDate < createdDate) {
          continue;
        }

        const hasCompletion = completions.some(
          (completion) => completion.completedOnDate.slice(0, 10) === lapseDate,
        );

        if (!hasCompletion) {
          const existing = data.habitLapses.find(
            (lapse) => lapse.habitId === habit.id && lapse.lapseDate === lapseDate,
          );
          if (!existing) {
            data.habitLapses.push({
              id: crypto.randomUUID(),
              habitId: habit.id,
              userId,
              lapseDate,
              createdAt: new Date().toISOString(),
            });
          }
        }
      } else {
        const previousWeek = getPreviousHabitWeekRange(timeZone, resetHour);
        const count = completions.filter((completion) => {
          const dayKey = completion.completedOnDate.slice(0, 10);
          return dayKey >= previousWeek.start && dayKey <= previousWeek.end;
        }).length;
        const lapseDate = previousWeek.end;
        if (lapseDate < createdDate) {
          continue;
        }

        if (count < (habit.targetPerWeek ?? 1)) {
          const existing = data.habitLapses.find(
            (lapse) => lapse.habitId === habit.id && lapse.lapseDate === lapseDate,
          );
          if (!existing) {
            data.habitLapses.push({
              id: crypto.randomUUID(),
              habitId: habit.id,
              userId,
              lapseDate,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    for (const lapse of data.habitLapses) {
      if (lapse.userId === userId && !lapse.restartDate) {
        openLapses.push(lapse);
      }
    }

    return openLapses;
  });
}

export function isHabitCompleteToday(habit: Habit, userId: string) {
  const data = readStore();
  const user = data.users.find((entry) => entry.id === userId);
  if (!user) return false;
  const today = getHabitDayKey(new Date(), user.timezone, user.resetHour);
  return data.habitCompletions.some(
    (completion) =>
      completion.userId === userId &&
      completion.habitId === habit.id &&
      completion.completedOnDate.slice(0, 10) === today,
  );
}
