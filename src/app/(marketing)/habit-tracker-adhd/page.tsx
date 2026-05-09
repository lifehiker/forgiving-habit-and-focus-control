import { getSeoLandingPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageView } from "@/app/(marketing)/_components/seo-landing-page-view";

const page = getSeoLandingPage("habit-tracker-adhd")!;
export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: "/habit-tracker-adhd",
  keywords: ["habit tracker for ADHD adults", "ADHD habit tracker"],
});

export default function HabitTrackerAdhdPage() {
  return <SeoLandingPageView page={page} />;
}
