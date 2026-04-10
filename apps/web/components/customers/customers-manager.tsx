"use client";

import { useMemo, useState, useTransition } from "react";
import { CustomerForm } from "@/components/forms/customer-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Customer, UserRole } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function CustomersManager({
  initialCustomers,
  role
}: {
  initialCustomers: Customer[];
  role: UserRole;
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canManage = role === "admin";

  const orderedCustomers = useMemo(
    () => [...customers].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    [customers]
  );

  function handleRequest(
    url: string,
    init: RequestInit,
    onSuccess: (payload: Customer | null) => void
  ) {
    setError(null);

    startTransition(async () => {
      const response = await fetch(url, init);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error ?? "Something went wrong.");
        return;
      }

      onSuccess(payload);
      setEditingCustomer(null);
    });
  }

  return (
    <div className="space-y-6">
      {canManage ? (
        <Card className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-dark">
              {editingCustomer ? "Edit customer" : "New customer"}
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
              {editingCustomer ? editingCustomer.name : "Add a customer"}
            </h2>
          </div>
          <CustomerForm
            busy={isPending}
            customer={editingCustomer}
            onCancel={() => setEditingCustomer(null)}
            onSubmit={async (values) => {
              const url = editingCustomer
                ? `/api/proxy/customers/${editingCustomer.id}`
                : "/api/proxy/customers";
              const method = editingCustomer ? "PATCH" : "POST";

              handleRequest(
                url,
                {
                  method,
                  headers: {
                    "content-type": "application/json"
                  },
                  body: JSON.stringify(values)
                },
                (payload) => {
                  if (!payload) {
                    return;
                  }

                  setCustomers((current) => {
                    if (editingCustomer) {
                      return current.map((item) => (item.id === payload.id ? payload : item));
                    }

                    return [payload, ...current];
                  });
                }
              );
            }}
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-slate-600">
            Your role is read-only for customer management. Admins can create, update, and delete records.
          </p>
        </Card>
      )}

      <div className="grid gap-4">
        {orderedCustomers.map((customer) => (
          <Card key={customer.id} className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-2xl font-semibold text-ink">{customer.name}</h3>
                <Badge value={customer.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{customer.email}</p>
              <p className="mt-1 text-sm text-slate-500">{customer.phone || "No phone number provided"}</p>
            </div>

            <div className="space-y-1 text-sm text-slate-500">
              <p>Created {formatDate(customer.createdAt)}</p>
              <p>Updated {formatDate(customer.updatedAt)}</p>
            </div>

            {canManage ? (
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Button type="button" variant="secondary" onClick={() => setEditingCustomer(customer)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    if (!window.confirm(`Delete ${customer.name}?`)) {
                      return;
                    }

                    handleRequest(
                      `/api/proxy/customers/${customer.id}`,
                      { method: "DELETE" },
                      () => {
                        setCustomers((current) =>
                          current.filter((item) => item.id !== customer.id)
                        );
                      }
                    );
                  }}
                >
                  Delete
                </Button>
              </div>
            ) : null}
          </Card>
        ))}

        {orderedCustomers.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-600">
              No customers yet. Create your first customer to populate dashboard metrics.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
