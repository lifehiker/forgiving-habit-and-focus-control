import { revalidatePath } from "next/cache";

import { addBlockedDomain, generateExtensionToken, removeBlockedDomain } from "@/lib/app";
import { buildRedirect } from "@/lib/form-routes";
import { requireUser } from "@/lib/session";
import { blocklistSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  if (intent === "add") {
    const parsed = blocklistSchema.safeParse({
      domain: formData.get("domain"),
    });

    if (!parsed.success) {
      return buildRedirect(request, "/settings/blocklist?error=Enter%20a%20clean%20domain%20like%20youtube.com.");
    }

    try {
      addBlockedDomain(user, parsed.data.domain);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add that blocked domain.";
      return buildRedirect(request, `/settings/blocklist?error=${encodeURIComponent(message)}`);
    }
  } else if (intent === "remove") {
    removeBlockedDomain(user.id, String(formData.get("domainId")));
  } else if (intent === "generate-token") {
    generateExtensionToken(user.id);
  }

  revalidatePath("/settings/blocklist");
  revalidatePath("/settings");
  return buildRedirect(request, "/settings/blocklist");
}
