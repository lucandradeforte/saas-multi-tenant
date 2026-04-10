import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-ink text-white hover:bg-slate-800",
  secondary: "bg-white text-slate-700 border border-slate-300 hover:border-brand hover:text-brand-dark",
  ghost: "text-slate-600 hover:bg-slate-100"
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
