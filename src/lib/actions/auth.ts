"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { maybeSendWelcomeEmail } from "@/lib/app";
import { trackEvent } from "@/lib/analytics";
import { sendLifecycleEmail } from "@/lib/email";
import { createOrUpdateUserByEmail, clearSession, getCurrentUser, setSession } from "@/lib/session";
import { mutateStore, readStore } from "@/lib/store";
import { requestCodeSchema, verifyCodeSchema } from "@/lib/validators";
import { createId } from "@/lib/utils";

export async function requestLoginCode(
  _prevState: { error?: string; previewCode?: string } | undefined,
  formData: FormData,
) {
  const parsed = requestCodeSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const { email, name } = parsed.data;
  const user = createOrUpdateUserByEmail(email, name || undefined);
  const code = String(Math.floor(100000 + Math.random() * 900000));

  mutateStore((data) => {
    data.loginCodes = data.loginCodes.filter(
      (entry) => !(entry.email === email && new Date(entry.expiresAt) > new Date()),
    );
    data.loginCodes.push({
      id: createId("code"),
      email,
      code,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  });

  const status = sendLifecycleEmail({
    userId: user.id,
    email,
    type: "login-code",
    preview: `Your sign-in code is ${code}. It expires in 15 minutes.`,
  });

  trackEvent("signup_completed", user.id);

  return {
    previewCode: status === "preview" ? code : undefined,
  };
}

export async function verifyLoginCode(formData: FormData) {
  const parsed = verifyCodeSchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    redirect("/login?error=invalid-code");
  }

  const { email, code } = parsed.data;
  const data = readStore();
  const validCode = data.loginCodes.find(
    (entry) =>
      entry.email === email &&
      entry.code === code &&
      new Date(entry.expiresAt) > new Date(),
  );

  if (!validCode) {
    redirect("/login?error=invalid-code");
  }

  const user = createOrUpdateUserByEmail(email);
  await setSession(user.id);
  maybeSendWelcomeEmail({
    ...user,
    subscription: readStore().subscriptions.find((entry) => entry.userId === user.id)!,
  });
  revalidatePath("/");
  redirect(user.onboardingCompleted ? "/dashboard" : "/onboarding");
}

export async function logout() {
  const user = await getCurrentUser();
  if (user) {
    trackEvent("logout", user.id);
  }
  await clearSession();
  redirect("/");
}
