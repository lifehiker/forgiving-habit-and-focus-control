import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/session";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return <AppShell user={user}>{children}</AppShell>;
}
