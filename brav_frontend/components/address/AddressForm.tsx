"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  createAddressApi,
  updateAddressApi,
} from "@/lib/api/address";

import type {
  Address,
  AddressType,
  CreateAddressPayload,
} from "@/types/address";

interface AddressFormProps {
  address: Address | null;
  onSaved: () => void;
  onCancel: () => void;
  onMessage: (
    message: {
      text: string;
      type: "success" | "error";
    } | null
  ) => void;
}

const emptyForm: CreateAddressPayload = {
  type: "shipping",
  full_name: "",
  phone: "",
  street_address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  is_default: false,
};

export default function AddressForm({
  address,
  onSaved,
  onCancel,
  onMessage,
}: AddressFormProps) {
  const [form, setForm] =
    useState<CreateAddressPayload>(emptyForm);

  const [isSaving, setIsSaving] = useState(false);

  const isEditing = address !== null;

  useEffect(() => {
    if (address) {
      setForm({
        type: address.type,
        full_name: address.full_name,
        phone: address.phone,
        street_address: address.street_address,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default,
      });
    } else {
      setForm(emptyForm);
    }
  }, [address]);

  function updateField(
    field: keyof CreateAddressPayload,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSaving(true);
    onMessage(null);

    try {
      let savedAddress: Address;

      if (isEditing) {
        savedAddress = await updateAddressApi(
          address.id,
          form
        );
      } else {
        savedAddress = await createAddressApi(form);
      }

      onSaved();

      onMessage({
        text: isEditing
          ? "Address updated successfully."
          : "Address added successfully.",
        type: "success",
      });
    } catch (error) {
      onMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to save address.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-brav-lg border border-brav-border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-brav-foreground">
          {isEditing
            ? "Edit Address"
            : "Add New Address"}
        </h2>

        <p className="mt-1 text-sm text-brav-muted">
          {isEditing
            ? "Update your saved address."
            : "Add a new shipping or billing address."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="address-type"
            className="mb-2 block text-sm font-medium text-brav-foreground"
          >
            Address Type
          </label>

          <select
            id="address-type"
            value={form.type}
            onChange={(event) =>
              updateField(
                "type",
                event.target.value as AddressType
              )
            }
            className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
          >
            <option value="shipping">
              Shipping
            </option>

            <option value="billing">
              Billing
            </option>
          </select>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="full-name"
              className="mb-2 block text-sm font-medium text-brav-foreground"
            >
              Full Name
            </label>

            <input
              id="full-name"
              value={form.full_name}
              onChange={(event) =>
                updateField(
                  "full_name",
                  event.target.value
                )
              }
              required
              className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-brav-foreground"
            >
              Phone
            </label>

            <input
              id="phone"
              value={form.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
              required
              className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="street-address"
            className="mb-2 block text-sm font-medium text-brav-foreground"
          >
            Street Address
          </label>

          <input
            id="street-address"
            value={form.street_address}
            onChange={(event) =>
              updateField(
                "street_address",
                event.target.value
              )
            }
            required
            className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className="mb-2 block text-sm font-medium text-brav-foreground"
            >
              City
            </label>

            <input
              id="city"
              value={form.city}
              onChange={(event) =>
                updateField(
                  "city",
                  event.target.value
                )
              }
              required
              className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="mb-2 block text-sm font-medium text-brav-foreground"
            >
              State / Province
            </label>

            <input
              id="state"
              value={form.state}
              onChange={(event) =>
                updateField(
                  "state",
                  event.target.value
                )
              }
              required
              className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="postal-code"
              className="mb-2 block text-sm font-medium text-brav-foreground"
            >
              Postal Code
            </label>

            <input
              id="postal-code"
              value={form.postal_code}
              onChange={(event) =>
                updateField(
                  "postal_code",
                  event.target.value
                )
              }
              required
              className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-brav-foreground"
            >
              Country
            </label>

            <input
              id="country"
              value={form.country}
              onChange={(event) =>
                updateField(
                  "country",
                  event.target.value
                )
              }
              required
              className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
            />
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(event) =>
              updateField(
                "is_default",
                event.target.checked
              )
            }
            className="h-4 w-4"
          />

          <span className="text-sm text-brav-foreground">
            Set as default address
          </span>
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-brav-md border border-brav-border px-5 py-2.5 text-sm font-medium hover:bg-brav-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-brav-md bg-brav-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Update Address"
                : "Add Address"}
          </button>
        </div>
      </form>
    </section>
  );
}