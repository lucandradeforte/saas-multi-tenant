import { redirect } from "next/navigation";
import { CustomersManager } from "@/components/customers/customers-manager";
import { Card } from "@/components/ui/card";
import { fetchBackend, getAccessTokenFromCookies, getSessionFromCookies } from "@/lib/api";
import { Customer } from "@/lib/types";

export default async function CustomersPage() {
  const session = await getSessionFromCookies();
  const accessToken = await getAccessTokenFromCookies();

  if (!session || !accessToken) {
    redirect("/login");
  }

  const customers = await fetchBackend<Customer[]>("/customers", {}, accessToken);

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-dark">Customer directory</p>
        <h1 className="font-display text-3xl font-semibold text-ink">Manage tenant customers</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          Customer records are automatically scoped to the authenticated tenant. Admins can manage the list, while regular users keep read-only visibility.
        </p>
      </Card>
      <CustomersManager initialCustomers={customers} role={session.role} />
    </div>
  );
}
