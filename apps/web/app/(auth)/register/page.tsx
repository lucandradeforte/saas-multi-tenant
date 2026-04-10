import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-16">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark">New tenant</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
              Launch your workspace
            </h1>
            <p className="mt-3 max-w-xl text-slate-600">
              Registration creates a company tenant and its first admin user in one flow, giving you a clean starting point for role-based SaaS onboarding.
            </p>
          </div>
          <RegisterForm />
        </Card>

        <Card className="flex flex-col justify-between bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white">
          <div className="space-y-6">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-white/70">Built-in architecture</p>
            <ul className="space-y-4 text-sm leading-7 text-white/90">
              <li>Next.js App Router with protected tenant routes.</li>
              <li>NestJS API with clean architecture, JWT auth, RBAC, and customer CRUD.</li>
              <li>.NET reporting service used by the dashboard through a secured internal endpoint.</li>
            </ul>
          </div>
          <p className="text-sm text-white/80">
            Already registered?{" "}
            <Link className="font-semibold text-white" href="/login">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
