import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { maybeSendWelcomeEmail } from "@/lib/app";
import { buildRedirect } from "@/lib/form-routes";
import { createOrUpdateUserByEmail, setSession } from "@/lib/session";
import { readStore } from "@/lib/store";
import { verifyCodeSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = verifyCodeSchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return buildRedirect(request, "/login?error=invalid-code");
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
    return buildRedirect(request, "/login?error=invalid-code");
  }

  const user = createOrUpdateUserByEmail(email);
  await setSession(user.id);
  maybeSendWelcomeEmail({
    ...user,
    subscription: readStore().subscriptions.find((entry) => entry.userId === user.id)!,
  });

  revalidatePath("/");
  return buildRedirect(request, user.onboardingCompleted ? "/dashboard" : "/onboarding");
}
