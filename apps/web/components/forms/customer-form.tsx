"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer } from "@/lib/types";

interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  status: Customer["status"];
}

const initialValues: CustomerFormValues = {
  name: "",
  email: "",
  phone: "",
  status: "lead"
};

export function CustomerForm({
  customer,
  busy,
  onSubmit,
  onCancel
}: {
  customer?: Customer | null;
  busy?: boolean;
  onSubmit: (values: CustomerFormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<CustomerFormValues>(initialValues);

  useEffect(() => {
    if (!customer) {
      setValues(initialValues);
      return;
    }

    setValues({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      status: customer.status
    });
  }, [customer]);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(values);
        if (!customer) {
          setValues(initialValues);
        }
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Customer name"
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <Input
          label="Phone"
          value={values.phone}
          onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
          placeholder="Optional"
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand"
            value={values.status}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                status: event.target.value as Customer["status"]
              }))
            }
          >
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button disabled={busy} type="submit">
          {busy ? "Saving..." : customer ? "Update customer" : "Create customer"}
        </Button>
        {customer && onCancel ? (
          <Button disabled={busy} type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
