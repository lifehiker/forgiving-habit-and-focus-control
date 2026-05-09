import { NextResponse } from "next/server";

import { trackEvent } from "@/lib/analytics";
import { sendLifecycleEmail } from "@/lib/email";
import { buildRedirect } from "@/lib/form-routes";
import { createOrUpdateUserByEmail } from "@/lib/session";
import { mutateStore } from "@/lib/store";
import { requestCodeSchema } from "@/lib/validators";
import { createId } from "@/lib/utils";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = requestCodeSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return buildRedirect(request, "/login?requestError=Enter%20a%20valid%20email%20address.");
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

  const params = new URLSearchParams({ email });
  if (status === "preview") {
    params.set("previewCode", code);
  }

  return NextResponse.redirect(new URL(`/login?${params.toString()}`, request.url), {
    status: 303,
  });
}
