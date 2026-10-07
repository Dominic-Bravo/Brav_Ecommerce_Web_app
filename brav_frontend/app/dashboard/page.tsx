"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Can from "@/components/auth/Can";
import LogoutButton from "@/components/auth/LogoutButton";
import { useAuth } from "@/context/AuthContext";

function DashboardContent() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-brav-secondary p-8">
      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brav-foreground">
              Welcome, {user.first_name}!
            </h1>

            <p className="mt-2 text-brav-muted">
              Welcome to your BRAV dashboard.
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* Common authenticated UI */}
        <div className="mt-8 rounded-brav-lg border border-brav-border bg-white p-6">
          <p className="text-sm text-brav-muted">
            Account
          </p>

          <p className="mt-2 text-lg font-semibold">
            {user.first_name} {user.last_name}
          </p>

          <p className="mt-1 text-sm text-brav-muted">
            {user.email}
          </p>

          <p className="mt-1 text-sm text-brav-muted">
            Role: {user.role}
          </p>
        </div>

        {/* Customer-only UI */}
        <Can permission="access_customer">
          <div className="mt-6 rounded-brav-lg border border-brav-border bg-white p-6">
            <h2 className="text-xl font-semibold">
              Customer Area
            </h2>

            <p className="mt-2 text-brav-muted">
              This section is visible only to customers.
            </p>

            <button
              type="button"
              className="mt-4 rounded-brav-md bg-brav-primary px-4 py-2 text-sm font-medium text-white hover:bg-brav-primary-hover"
            >
              Customer Action
            </button>
          </div>
        </Can>

        {/* Admin-only UI */}
        <Can permission="access_admin">
          <div className="mt-6 rounded-brav-lg border border-brav-border bg-white p-6">
            <h2 className="text-xl font-semibold">
              Admin Area
            </h2>

            <p className="mt-2 text-brav-muted">
              This section is visible only to administrators.
            </p>

            <button
              type="button"
              className="mt-4 rounded-brav-md bg-brav-primary px-4 py-2 text-sm font-medium text-white hover:bg-brav-primary-hover"
            >
              Admin Action
            </button>
          </div>
        </Can>

      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}