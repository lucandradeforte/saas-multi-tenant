import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className={cn(
          "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none ring-0 transition focus:border-brand focus:bg-white",
          error && "border-red-300 focus:border-red-400",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
