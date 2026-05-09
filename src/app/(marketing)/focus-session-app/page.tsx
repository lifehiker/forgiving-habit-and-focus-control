import { getSeoLandingPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageView } from "@/app/(marketing)/_components/seo-landing-page-view";

const page = getSeoLandingPage("focus-session-app")!;
export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: "/focus-session-app",
  keywords: ["focus session app", "anti distraction app", "strict focus session blocker"],
});

export default function FocusSessionAppPage() {
  return <SeoLandingPageView page={page} />;
}
