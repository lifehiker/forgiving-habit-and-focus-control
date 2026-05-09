"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addBlockedDomain, generateExtensionToken, removeBlockedDomain } from "@/lib/app";
import { requireUser } from "@/lib/session";
import { blocklistSchema } from "@/lib/validators";

export async function addBlockedDomainAction(formData: FormData) {
  const user = await requireUser();
  const parsed = blocklistSchema.safeParse({
    domain: formData.get("domain"),
  });

  if (!parsed.success) {
    redirect("/settings/blocklist?error=Enter%20a%20clean%20domain%20like%20youtube.com.");
  }

  try {
    addBlockedDomain(user, parsed.data.domain);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to add that blocked domain.";
    redirect(`/settings/blocklist?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/settings/blocklist");
}

export async function removeBlockedDomainAction(formData: FormData) {
  const user = await requireUser();
  removeBlockedDomain(user.id, String(formData.get("domainId")));
  revalidatePath("/settings/blocklist");
}

export async function generateExtensionTokenAction() {
  const user = await requireUser();
  generateExtensionToken(user.id);
  revalidatePath("/settings/blocklist");
}
