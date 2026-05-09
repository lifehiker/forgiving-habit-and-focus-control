import { mutateStore } from "@/lib/store";
import type { EmailType } from "@/lib/types";
import { createId } from "@/lib/utils";

export function sendLifecycleEmail(args: {
  userId?: string;
  email: string;
  type: EmailType;
  preview: string;
}) {
  const status = process.env.RESEND_API_KEY ? "sent" : "preview";

  mutateStore((data) => {
    data.emailLogs.push({
      id: createId("email"),
      userId: args.userId,
      email: args.email,
      type: args.type,
      status,
      preview: args.preview,
      createdAt: new Date().toISOString(),
    });
  });

  return status;
}
