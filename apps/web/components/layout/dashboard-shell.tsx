import { Badge } from "@/components/ui/badge";
import { SessionUser } from "@/lib/types";
import { LogoutButton } from "./logout-button";
import { Sidebar } from "./sidebar";

export function DashboardShell({
  session,
  children
}: {
  session: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell min-h-screen">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass-panel h-fit space-y-8 p-6">
          <div>
            <p className="font-display text-2xl font-semibold text-ink">TenantFlow</p>
            <p className="mt-2 text-sm text-slate-500">Multi-tenant operations workspace</p>
          </div>
          <Sidebar />
        </aside>

        <div className="space-y-6">
          <header className="glass-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark">Tenant workspace</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
                {session.name}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{session.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge value={session.role} />
              <LogoutButton />
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
