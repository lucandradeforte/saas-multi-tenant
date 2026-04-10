import Link from "next/link";
import { appName } from "@/lib/env";

const benefits = [
  "Tenant-aware architecture with clean boundaries across frontend and services.",
  "JWT + refresh token auth using HttpOnly cookies and route protection.",
  "PostgreSQL-backed customer management with dashboard metrics and reporting."
];

export default function HomePage() {
  return (
    <main className="page-shell flex min-h-screen flex-col justify-center">
      <section className="glass-panel relative overflow-hidden px-8 py-14 sm:px-12 lg:px-16">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-brand/10 via-brand-light/5 to-transparent" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-brand-dark">
              Modern SaaS starter
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Build tenant-aware products faster with <span className="gradient-text">{appName}</span>.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                A full-stack foundation for teams that need clean architecture, role-based access, customer CRUD, dashboard metrics, and a support reporting service without starting from a blank repo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create workspace
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand-dark"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {benefits.map((benefit, index) => (
              <article
                key={benefit}
                className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm"
                style={{ transform: `translateY(${index * 8}px)` }}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark">
                  0{index + 1}
                </p>
                <p className="mt-3 text-base leading-7 text-slate-700">{benefit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
