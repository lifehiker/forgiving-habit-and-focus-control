import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getUserSubscription } from "@/lib/billing";
import { mutateStore, readStore } from "@/lib/store";
import type { AppUser, User } from "@/lib/types";
import { createId } from "@/lib/utils";

const cookieName = "fhfc_session";

export async function setSession(userId: string) {
  const token = createId("sess");
  mutateStore((data) => {
    data.sessions.push({
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  });

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (token) {
    mutateStore((data) => {
      data.sessions = data.sessions.filter((session) => session.token !== token);
    });
  }
  cookieStore.delete(cookieName);
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  const data = readStore();
  const session = data.sessions.find(
    (entry) => entry.token === token && new Date(entry.expiresAt) > new Date(),
  );
  if (!session) return null;

  const user = data.users.find((entry) => entry.id === session.userId);
  if (!user) return null;

  return {
    ...user,
    subscription: getUserSubscription(user.id),
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function createOrUpdateUserByEmail(email: string, name?: string) {
  return mutateStore((data) => {
    let user = data.users.find((entry) => entry.email === email);
    if (user) {
      user.updatedAt = new Date().toISOString();
      user.lastActiveAt = new Date().toISOString();
      if (name) user.name = name;
      return user;
    }

    user = {
      id: createId("user"),
      email,
      name: name?.trim() || email.split("@")[0] || "Restarting Human",
      timezone: "UTC",
      resetHour: 5,
      rebuildGoal: "",
      onboardingCompleted: false,
      allowEmergencyOverride: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    data.users.push(user);
    data.subscriptions.push({
      id: createId("sub"),
      userId: user.id,
      plan: "free",
      status: "free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return user;
  });
}

export function touchUser(user: User) {
  mutateStore((data) => {
    const existing = data.users.find((entry) => entry.id === user.id);
    if (existing) {
      existing.lastActiveAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
    }
  });
}
