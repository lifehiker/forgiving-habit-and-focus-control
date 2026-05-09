import { format, formatDistanceToNowStrict } from "date-fns";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

export function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy h:mm a");
}

export function relativeDuration(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function clamp(number: number, min: number, max: number) {
  return Math.min(max, Math.max(min, number));
}
