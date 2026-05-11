import { z } from "zod";

const optionalNumberFromForm = () =>
  z.preprocess(
    (value) => {
      if (value === null || value === undefined || value === "") {
        return undefined;
      }
      return value;
    },
    z.coerce.number().optional(),
  );

export const requestCodeSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).max(50).optional().or(z.literal("")),
});

export const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().trim().length(6),
});

export const onboardingSchema = z.object({
  rebuildGoal: z.string().trim().min(3).max(120),
  timezone: z.string().trim().min(2).max(80),
  resetHour: z.coerce.number().min(0).max(23),
  starterHabits: z.array(z.string()).max(5),
  customHabitName: z.string().trim().max(60).optional(),
});

export const habitSchema = z.object({
  name: z.string().trim().min(2).max(60),
  cadenceType: z.enum(["daily", "weekly"]),
  targetPerWeek: optionalNumberFromForm().refine(
    (value) => value === undefined || (value >= 1 && value <= 7),
    "Weekly target must be between 1 and 7.",
  ),
  category: z.string().trim().min(2).max(30),
});

export const restartSchema = z.object({
  habitId: z.string().min(1),
  restartReason: z.enum([
    "busy",
    "forgot",
    "low-energy",
    "disrupted-schedule",
    "other",
  ]),
});

export const focusSchema = z.object({
  label: z.string().trim().min(2).max(60),
  durationMinutes: z.coerce.number().min(15).max(180),
  habitId: z.string().optional(),
});

export const blocklistSchema = z.object({
  domain: z
    .string()
    .trim()
    .min(4)
    .max(120)
    .transform((value) => value.replace(/^https?:\/\//, "").replace(/\/.*$/, "")),
});
