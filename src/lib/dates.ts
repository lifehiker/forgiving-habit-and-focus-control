import { formatISO, parseISO, startOfWeek, subDays } from "date-fns";

function getParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
  };
}

function dayKeyToDate(dayKey: string) {
  return parseISO(`${dayKey}T12:00:00Z`);
}

export function getHabitDayKey(
  date: Date,
  timeZone: string,
  resetHour: number,
) {
  const parts = getParts(date, timeZone);
  const anchor = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));

  if (parts.hour < resetHour) {
    anchor.setUTCDate(anchor.getUTCDate() - 1);
  }

  return formatISO(anchor, { representation: "date" });
}

export function getPreviousHabitDayKey(
  timeZone: string,
  resetHour: number,
  date = new Date(),
) {
  const current = dayKeyToDate(getHabitDayKey(date, timeZone, resetHour));
  return formatISO(subDays(current, 1), { representation: "date" });
}

export function getPreviousHabitWeekRange(
  timeZone: string,
  resetHour: number,
  date = new Date(),
) {
  const currentHabitDay = dayKeyToDate(getHabitDayKey(date, timeZone, resetHour));
  const currentWeekStart = startOfWeek(currentHabitDay, { weekStartsOn: 1 });
  const previousWeekStart = subDays(currentWeekStart, 7);
  const previousWeekEnd = subDays(currentWeekStart, 1);

  return {
    start: formatISO(previousWeekStart, { representation: "date" }),
    end: formatISO(previousWeekEnd, { representation: "date" }),
  };
}
