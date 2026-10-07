"use client";

import type { Address } from "@/types/address";

interface DeleteAddressDialogProps {
  address: Address | null;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteAddressDialog({
  address,
  onCancel,
  onConfirm,
  isDeleting,
}: DeleteAddressDialogProps) {
  if (!address) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-brav-lg bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-brav-foreground">
          Delete address?
        </h2>

        <p className="mt-3 text-sm text-brav-muted">
          Are you sure you want to delete the address
          for{" "}
          <span className="font-medium text-brav-foreground">
            {address.full_name}
          </span>
          ?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-brav-md border border-brav-border px-4 py-2 text-sm font-medium text-brav-foreground hover:bg-brav-secondary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-brav-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Address"}
          </button>
        </div>
      </div>
    </div>
  );
}