"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartBarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: ChartBarIcon },
  { href: "/customers", label: "Customers", icon: UsersIcon }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
              active
                ? "bg-ink text-white shadow-lg"
                : "text-slate-600 hover:bg-white/70 hover:text-ink"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
