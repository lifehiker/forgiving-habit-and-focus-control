import { getSeoLandingPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageView } from "@/app/(marketing)/_components/seo-landing-page-view";

const page = getSeoLandingPage("habit-tracker-no-streak")!;
export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: "/habit-tracker-no-streak",
  keywords: ["habit tracker no streak", "habit tracker without guilt"],
});

export default function HabitTrackerNoStreakPage() {
  return <SeoLandingPageView page={page} />;
}
