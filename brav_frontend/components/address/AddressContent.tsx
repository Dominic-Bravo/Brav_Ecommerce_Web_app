"use client";

import { useCallback, useEffect, useState } from "react";

import type { Address } from "@/types/address";

import {
  deleteAddressApi,
  deleteAddressesApi,
  getAddressesApi,
} from "@/lib/api/address";

import AddressAlert from "./AddressAlert";
import AddressForm from "./AddressForm";
import AddressList from "./AddressList";
import AddressSelectionBar from "./AddressSelectionBar";
import DeleteAddressDialog from "./DeleteAddressDialog";

interface AddressMessage {
  text: string;
  type: "success" | "error";
}

export default function AddressContent() {
  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [deletingAddress, setDeletingAddress] =
    useState<Address | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [message, setMessage] =
    useState<AddressMessage | null>(null);

  const loadAddresses = useCallback(
    async () => {
      try {
        setIsLoading(true);

        const data = await getAddressesApi();

        setAddresses(data);
      } catch (error) {
        setMessage({
          text:
            error instanceof Error
              ? error.message
              : "Failed to load addresses.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  function handleSelect(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (selectedId) => selectedId !== id
        );
      }

      return [...current, id];
    });
  }

  function handleSelectAll() {
    setSelectedIds(
      addresses.map((address) => address.id)
    );
  }

  function handleClearSelection() {
    setSelectedIds([]);
  }

  function handleAdd() {
    setEditingAddress(null);
    setShowForm(true);
    setMessage(null);
  }

  function handleEdit(address: Address) {
    setEditingAddress(address);
    setShowForm(true);
    setMessage(null);
  }

  function handleCancelForm() {
    setEditingAddress(null);
    setShowForm(false);
  }

  async function handleSaved() {
      setEditingAddress(null);
      setShowForm(false);

      await loadAddresses();
    }

  function handleDeleteRequest(address: Address) {
    setDeletingAddress(address);
  }

  async function handleDeleteConfirmed() {
    if (!deletingAddress) {
      return;
    }

    try {
      setIsDeleting(true);
      setMessage(null);

      await deleteAddressApi(
        deletingAddress.id
      );

      setAddresses((current) =>
        current.filter(
          (address) =>
            address.id !== deletingAddress.id
        )
      );

      setSelectedIds((current) =>
        current.filter(
          (id) => id !== deletingAddress.id
        )
      );

      setDeletingAddress(null);

      setMessage({
        text: "Address deleted successfully.",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete address.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} selected address${
        selectedIds.length === 1 ? "" : "es"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setMessage(null);

      const idsToDelete = [...selectedIds];

      const result =
        await deleteAddressesApi(idsToDelete);

      const successfulIds = new Set(
        idsToDelete
      );

      if (result.failed > 0) {
        // Reload from backend because we don't know
        // exactly which requests failed.
        await loadAddresses();
      } else {
        setAddresses((current) =>
          current.filter(
            (address) =>
              !successfulIds.has(address.id)
          )
        );
      }

      setSelectedIds([]);

      if (result.failed === 0) {
        setMessage({
          text: `${result.successful} address${
            result.successful === 1
              ? ""
              : "es"
          } deleted successfully.`,
          type: "success",
        });
      } else {
        setMessage({
          text: `${result.successful} address${
            result.successful === 1
              ? ""
              : "es"
          } deleted, but ${
            result.failed
          } could not be deleted.`,
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to delete selected addresses.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-brav-secondary p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brav-foreground">
              My Addresses
            </h1>

            <p className="mt-2 text-brav-muted">
              Manage your shipping and billing addresses.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-brav-md bg-brav-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brav-primary-hover"
            >
              + Add Address
            </button>
          )}
        </div>

        <AddressAlert message={message} />

        {showForm ? (
          <div className="mt-8">
            <AddressForm
              address={editingAddress}
              onSaved={handleSaved}
              onCancel={handleCancelForm}
              onMessage={setMessage}
            />
          </div>
        ) : (
          <>
            <AddressSelectionBar
              selectedCount={selectedIds.length}
              totalCount={addresses.length}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onDeleteSelected={
                handleDeleteSelected
              }
              isDeleting={isDeleting}
            />

            <div className="mt-6">
              {isLoading ? (
                <div className="rounded-brav-lg border border-brav-border bg-white p-10 text-center">
                  <p className="text-sm text-brav-muted">
                    Loading addresses...
                  </p>
                </div>
              ) : (
                <AddressList
                  addresses={addresses}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                  onEdit={handleEdit}
                  onDelete={
                    handleDeleteRequest
                  }
                />
              )}
            </div>
          </>
        )}
      </div>

      <DeleteAddressDialog
        address={deletingAddress}
        onCancel={() =>
          setDeletingAddress(null)
        }
        onConfirm={handleDeleteConfirmed}
        isDeleting={isDeleting}
      />
    </main>
  );
}