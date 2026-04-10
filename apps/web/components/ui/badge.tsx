import { cn } from "@/lib/utils";

const badgeStyles = {
  admin: "bg-brand/10 text-brand-dark",
  user: "bg-slate-200 text-slate-700",
  active: "bg-emerald-100 text-emerald-700",
  lead: "bg-amber-100 text-amber-700",
  inactive: "bg-rose-100 text-rose-700"
};

export function Badge({ value }: { value: keyof typeof badgeStyles }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        badgeStyles[value]
      )}
    >
      {value}
    </span>
  );
}
