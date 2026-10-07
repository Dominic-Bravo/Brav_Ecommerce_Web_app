"use client";

import type { Address } from "@/types/address";

interface AddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <div
      className={`rounded-brav-lg border bg-white p-6 shadow-sm transition ${
        selected
          ? "border-brav-primary"
          : "border-brav-border"
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(address.id)}
          className="mt-1 h-4 w-4"
          aria-label={`Select ${address.full_name}'s address`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-brav-foreground">
                {address.full_name}
              </h3>

              <p className="mt-1 text-sm capitalize text-brav-muted">
                {address.type}
              </p>
            </div>

            {address.is_default && (
              <span className="rounded-full bg-brav-primary/10 px-3 py-1 text-xs font-medium text-brav-primary">
                Default
              </span>
            )}
          </div>

          <div className="mt-4 space-y-1 text-sm text-brav-muted">
            <p>{address.phone}</p>

            <p>{address.street_address}</p>

            <p>
              {address.city}, {address.state}
            </p>

            <p>
              {address.postal_code}, {address.country}
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => onEdit(address)}
              className="rounded-brav-md border border-brav-border px-4 py-2 text-sm font-medium text-brav-foreground transition hover:bg-brav-secondary"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(address)}
              className="rounded-brav-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}