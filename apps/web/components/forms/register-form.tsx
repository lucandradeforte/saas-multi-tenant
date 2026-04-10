"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Acme Labs");
  const [companySlug, setCompanySlug] = useState("");
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@tenantflow.dev");
  const [password, setPassword] = useState("Password123");
  const suggestedSlug = useMemo(() => slugify(companyName), [companyName]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          companyName,
          companySlug: companySlug || suggestedSlug,
          name,
          email,
          password
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Registration failed." }));
        setError(payload.error ?? payload.message ?? "Registration failed.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        label="Company name"
        value={companyName}
        onChange={(event) => setCompanyName(event.target.value)}
        placeholder="Acme Labs"
        required
      />
      <Input
        label="Company slug"
        value={companySlug}
        onChange={(event) => setCompanySlug(event.target.value)}
        placeholder={suggestedSlug || "acme-labs"}
        required
      />
      <Input
        label="Your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Admin User"
        required
      />
      <Input
        label="Work email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="At least 8 characters"
        required
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Creating workspace..." : "Create workspace"}
      </Button>
      <p className="text-sm text-slate-500">
        Already have a workspace?{" "}
        <Link className="font-semibold text-brand-dark" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
