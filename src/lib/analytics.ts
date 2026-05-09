import { mutateStore } from "@/lib/store";
import type { AnalyticsEvent } from "@/lib/types";
import { createId } from "@/lib/utils";

export function trackEvent(
  name: AnalyticsEvent["name"],
  userId?: string,
  metadata?: AnalyticsEvent["metadata"],
) {
  mutateStore((data) => {
    data.analyticsEvents.push({
      id: createId("evt"),
      name,
      userId,
      metadata,
      createdAt: new Date().toISOString(),
    });
  });
}
