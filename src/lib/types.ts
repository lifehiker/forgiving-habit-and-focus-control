export type CadenceType = "daily" | "weekly";
export type RestartReason =
  | "busy"
  | "forgot"
  | "low-energy"
  | "disrupted-schedule"
  | "other";
export type FocusSessionStatus =
  | "active"
  | "completed"
  | "cancelled"
  | "expired";
export type SubscriptionPlan = "free" | "pro-monthly" | "pro-yearly";
export type SubscriptionStatus = "free" | "trialing" | "active" | "canceled";
export type EmailType =
  | "login-code"
  | "welcome"
  | "restart-nudge"
  | "upgrade-confirmation";

export type User = {
  id: string;
  email: string;
  name: string;
  timezone: string;
  resetHour: number;
  rebuildGoal: string;
  onboardingCompleted: boolean;
  allowEmergencyOverride: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  lastRestartNudgeAt?: string;
};

export type AuthSession = {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type LoginCode = {
  id: string;
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
};

export type Habit = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  cadenceType: CadenceType;
  targetPerWeek: number | null;
  category: string;
  isArchived: boolean;
  createdAt: string;
};

export type HabitCompletion = {
  id: string;
  habitId: string;
  userId: string;
  completedOnDate: string;
  source: "manual" | "focus-session";
  createdAt: string;
};

export type HabitLapse = {
  id: string;
  habitId: string;
  userId: string;
  lapseDate: string;
  restartDate?: string;
  restartReason?: RestartReason;
  createdAt: string;
};

export type FocusSession = {
  id: string;
  userId: string;
  habitId?: string;
  label: string;
  durationMinutes: number;
  startedAt: string;
  endsAt: string;
  completedAt?: string;
  status: FocusSessionStatus;
  allowOverride: boolean;
};

export type BlockedDomain = {
  id: string;
  userId: string;
  domain: string;
  isActive: boolean;
  createdAt: string;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ExtensionToken = {
  id: string;
  userId: string;
  token: string;
  createdAt: string;
  lastUsedAt?: string;
};

export type AnalyticsEvent = {
  id: string;
  userId?: string;
  name: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
};

export type EmailLog = {
  id: string;
  userId?: string;
  email: string;
  type: EmailType;
  status: "sent" | "preview" | "skipped";
  preview?: string;
  createdAt: string;
};

export type AppData = {
  users: User[];
  sessions: AuthSession[];
  loginCodes: LoginCode[];
  habits: Habit[];
  habitCompletions: HabitCompletion[];
  habitLapses: HabitLapse[];
  focusSessions: FocusSession[];
  blockedDomains: BlockedDomain[];
  subscriptions: Subscription[];
  extensionTokens: ExtensionToken[];
  analyticsEvents: AnalyticsEvent[];
  emailLogs: EmailLog[];
};

export type AppUser = User & {
  subscription: Subscription;
};
