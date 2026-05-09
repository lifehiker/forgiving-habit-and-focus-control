import { getSeoLandingPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageView } from "@/app/(marketing)/_components/seo-landing-page-view";

const page = getSeoLandingPage("forgiving-habit-tracker")!;
export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: "/forgiving-habit-tracker",
  keywords: ["forgiving habit tracker", "restart habit tracker", "habit app restart after failing"],
});

export default function ForgivingHabitTrackerPage() {
  return <SeoLandingPageView page={page} />;
}
