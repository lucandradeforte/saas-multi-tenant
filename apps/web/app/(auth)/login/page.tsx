import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-16">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="flex flex-col justify-between bg-ink text-white">
          <div className="space-y-6">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-brand-light">
              Welcome back
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight">
              Sign in to manage customers, metrics, and reporting.
            </h1>
            <p className="text-slate-300">
              Use the seeded admin credentials after registering your first tenant, or create a new workspace if you are starting fresh.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
            Need an account?{" "}
            <Link className="font-semibold text-white" href="/register">
              Create a workspace
            </Link>
          </div>
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark">Authentication</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Sign in</h2>
          </div>
          <LoginForm />
        </Card>
      </div>
    </main>
  );
}
