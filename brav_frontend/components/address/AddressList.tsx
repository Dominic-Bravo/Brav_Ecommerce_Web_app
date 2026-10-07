"use client";

import type { Address } from "@/types/address";
import AddressCard from "./AddressCard";

interface AddressListProps {
  addresses: Address[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

export default function AddressList({
  addresses,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="rounded-brav-lg border border-dashed border-brav-border bg-white p-10 text-center">
        <h3 className="font-semibold text-brav-foreground">
          No saved addresses
        </h3>

        <p className="mt-2 text-sm text-brav-muted">
          Add an address to make checkout faster.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          selected={selectedIds.includes(address.id)}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}