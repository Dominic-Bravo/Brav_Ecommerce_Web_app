"use client";

import { Can } from "@/components/auth/Can";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { getUsersApi } from "@/lib/api/users";

const CUSTOMER_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "customer", label: "Customer" },
];

export default function AdminCustomersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Only fetch customers if user is authenticated as admin
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user || user.role !== "admin") return;

    async function loadCustomers() {
      try {
        const users = await getUsersApi();
        setCustomers(users);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, [user, isAuthLoading]);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      // In a real implementation, this would call a DELETE endpoint like /api/v1/users/{customerId}/
      setCustomers(customers.filter((c) => c.id !== customerId));
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const handleSaveCustomer = (data: any) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...data } : c
        )
      );
    } else {
      // Create new customer
      const newCustomer = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setCustomers([...customers, newCustomer]);
    }
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    setShowForm(false);
    setEditingCustomer(null);
  };

  const getValidNextRoles = (currentRole: string): string[] => {
    if (currentRole === "customer") {
      return ["admin"];
    }
    return [];
  };

  if (isAuthLoading || isLoading) {
    return (
      <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Customer Management
        </h1>
        <p className="text-brav-muted">Loading customers...</p>
      </section>
    );
  }

  // If user is not admin, show access denied
  if (!user || user.role !== "admin") {
    return (
      <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Customer Management
        </h1>
        <p className="text-brav-muted text-red-600">
          Access denied. Admin privileges required.
        </p>
      </section>
    );
  }

  return (
    <ProtectedRoute>
      <Can permission="access_admin" fallback={null}>
        <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Customer Management
        </h1>

        <div className="mb-6">
          <Can permission="access_admin">
            <button
              type="button"
              onClick={handleAddCustomer}
              className="rounded-brav-md bg-brav-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover mb-4"
            >
              Add New Customer
            </button>
          </Can>
        </div>

        <div className="overflow-x-auto rounded-brav-lg border border-brav-border bg-white shadow-sm">
          <table className="min-w-full rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-brav-border text-brav-foreground">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const validNextRoles = getValidNextRoles(customer.role);
                return (
                  <tr key={customer.id} className="border-b border-brav-border hover:bg-brav-background/50">
                    <td className="p-4 font-medium text-brav-foreground">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="p-4 text-brav-muted">{customer.email}</td>
                    <td className="p-4 text-brav-muted">{customer.phone}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                          customer.role === "admin"
                            ? "bg-brav-primary text-white"
                            : "bg-brav-secondary text-brav-foreground"
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                          customer.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <Can permission="access_admin">
                          <button
                            type="button"
                            onClick={() => handleEditCustomer(customer)}
                            className="rounded-brav-md bg-brav-secondary px-2 py-1 text-xs font-medium text-brav-foreground hover:bg-brav-secondary-hover text-center"
                          >
                            Edit
                          </button>
                        </Can>

                        <Can permission="access_admin">
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="rounded-brav-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 text-center"
                          >
                            Delete
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {customers.length === 0 && (
            <div className="p-8 text-center text-brav-muted">
              No customers found
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-brav-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const data = {
                    email: formData.get("email"),
                    first_name: formData.get("first_name"),
                    last_name: formData.get("last_name"),
                    phone: formData.get("phone"),
                    role: formData.get("role"),
                    is_active: formData.get("is_active") === "on",
                  };
                  handleSaveCustomer(data);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brav-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingCustomer?.email || ""}
                      required
                      className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brav-foreground mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      defaultValue={editingCustomer?.first_name || ""}
                      required
                      className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brav-foreground mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      defaultValue={editingCustomer?.last_name || ""}
                      required
                      className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brav-foreground mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={editingCustomer?.phone || ""}
                      className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brav-foreground mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      defaultValue={editingCustomer?.role || "customer"}
                      required
                      className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
                    >
                      {CUSTOMER_ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brav-foreground mb-1">
                      Status
                    </label>
                    <select
                      name="is_active"
                      defaultValue={editingCustomer?.is_active ? "true" : "false"}
                      className="w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brav-primary"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    className="rounded-brav-md bg-brav-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover"
                  >
                    Save Customer
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-brav-md bg-brav-secondary px-4 py-2.5 text-sm font-medium text-brav-foreground hover:bg-brav-secondary-hover"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </Can>
    </ProtectedRoute>
  );
}