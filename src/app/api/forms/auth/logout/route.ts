import { trackEvent } from "@/lib/analytics";
import { buildRedirect } from "@/lib/form-routes";
import { clearSession, getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (user) {
    trackEvent("logout", user.id);
  }
  await clearSession();
  return buildRedirect(request, "/");
}
