"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@/types/auth";
import { updateUserApi } from "@/lib/api/auth";

interface AccountInfoFormProps {
  user: User;
  onUserUpdated: (user: User) => void;
  onMessage: (
    message: {
      text: string;
      type: "success" | "error";
    } | null
  ) => void;
}

export default function AccountInfoForm({
  user,
  onUserUpdated,
  onMessage,
}: AccountInfoFormProps) {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [phone, setPhone] = useState(user.phone || "");

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhone(user.phone || "");
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsUpdating(true);
    onMessage(null);

    try {
      const updatedUser = await updateUserApi({
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      onUserUpdated(updatedUser);

      onMessage({
        text: "Account information updated successfully.",
        type: "success",
      });
    } catch (error) {
      onMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to update account information.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <section className="mt-8 rounded-brav-lg border border-brav-border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-brav-border pb-4">
        <div>
          <h2 className="text-xl font-semibold text-brav-foreground">
            Account Information
          </h2>

          <p className="text-xs text-brav-muted">
            Update your basic account information.
          </p>
        </div>

        <span className="rounded-full bg-brav-secondary px-3 py-1 text-xs font-medium uppercase text-brav-foreground">
          Role: {user.role}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-brav-foreground"
            >
              First Name
            </label>

            <input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(event.target.value)
              }
              className="mt-1 block w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:border-brav-primary focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-brav-foreground"
            >
              Last Name
            </label>

            <input
              id="last_name"
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(event.target.value)
              }
              className="mt-1 block w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:border-brav-primary focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brav-muted"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="mt-1 block w-full cursor-not-allowed rounded-brav-md border border-brav-border bg-gray-100 p-2.5 text-sm text-brav-muted"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-brav-foreground"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              className="mt-1 block w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:border-brav-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-brav-md bg-brav-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating
              ? "Saving..."
              : "Update Account Info"}
          </button>
        </div>
      </form>
    </section>
  );
}