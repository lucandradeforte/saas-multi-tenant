import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getSessionFromCookies } from "@/lib/api";

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/login");
  }

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
