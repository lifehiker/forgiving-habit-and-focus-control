import { getSeoLandingPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageView } from "@/app/(marketing)/_components/seo-landing-page-view";

const page = getSeoLandingPage("website-blocker-for-deep-work")!;
export const metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: "/website-blocker-for-deep-work",
  keywords: ["website blocker for deep work", "app blocker that actually works"],
});

export default function WebsiteBlockerPage() {
  return <SeoLandingPageView page={page} />;
}
