import { BoltIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { fetchBackend, getAccessTokenFromCookies, getSessionFromCookies } from "@/lib/api";
import { DashboardMetrics } from "@/lib/types";

const metricCards = [
  { key: "users", label: "Users", icon: UsersIcon },
  { key: "admins", label: "Admins", icon: BoltIcon },
  { key: "customers", label: "Customers", icon: ChartBarIcon },
  { key: "activeCustomers", label: "Active customers", icon: ChartBarIcon }
] as const;

export default async function DashboardPage() {
  const session = await getSessionFromCookies();
  const accessToken = await getAccessTokenFromCookies();

  if (!session || !accessToken) {
    redirect("/login");
  }

  const metrics = await fetchBackend<DashboardMetrics>(
    "/dashboard/metrics",
    {},
    accessToken
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ key, label, icon: Icon }) => (
          <Card key={key} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                {label}
              </p>
              <Icon className="h-5 w-5 text-brand-dark" />
            </div>
            <p className="font-display text-4xl font-semibold text-ink">
              {metrics.totals[key]}
            </p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-dark">Health report</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                Reporting service insights
              </h2>
            </div>
            <div className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
              {metrics.report.healthScore}/100
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-sand p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Conversion rate</p>
              <p className="mt-3 font-display text-4xl font-semibold text-ink">
                {metrics.report.customerConversionRate}%
              </p>
            </div>
            <div className="rounded-2xl bg-sand p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New customers</p>
              <p className="mt-3 font-display text-4xl font-semibold text-ink">
                {metrics.growth.newCustomersLast30Days}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {metrics.report.highlights.map((highlight) => (
              <div key={highlight} className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700">
                {highlight}
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-6 bg-ink text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-light">Tenant summary</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Operational pulse</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-200">
            <p>
              Your tenant currently has {metrics.totals.customers} total customers, with {metrics.totals.activeCustomers} marked as active and {metrics.totals.admins} admin users supporting the workspace.
            </p>
            <p>
              Dashboard responses are cached in Redis for short-lived acceleration, while the supporting .NET service enriches the reporting layer via an internal API call.
            </p>
            <p>
              Report generated at {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short"
              }).format(new Date(metrics.report.generatedAt))}.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
