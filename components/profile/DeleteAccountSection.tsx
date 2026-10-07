"use client";

import { useState } from "react";
import {
  deleteAccountApi,
} from "@/lib/api/auth";

interface DeleteAccountSectionProps {
  onDeleted: () => Promise<void>;
  onMessage: (
    message: {
      text: string;
      type: "success" | "error";
    } | null
  ) => void;
}

export default function DeleteAccountSection({
  onDeleted,
  onMessage,
}: DeleteAccountSectionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    onMessage(null);

    try {
      await deleteAccountApi();

      await onDeleted();
    } catch (error) {
      onMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete account.",
        type: "error",
      });

      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="mt-6 rounded-brav-lg border border-red-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-red-600">
        Danger Zone
      </h2>

      <p className="mt-1 text-sm text-brav-muted">
        Deleting your account will permanently remove
        your account and access.
      </p>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="mt-4 rounded-brav-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete Account
        </button>
      ) : (
        <div className="mt-4 rounded-brav-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Are you completely sure you want to delete
            your account?
          </p>

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-brav-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting
                ? "Deleting..."
                : "Yes, Delete My Account"}
            </button>

            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="rounded-brav-md border border-brav-border bg-white px-4 py-2 text-sm font-medium text-brav-foreground hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}