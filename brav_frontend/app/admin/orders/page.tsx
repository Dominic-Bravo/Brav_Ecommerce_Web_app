"use client";

import { Can } from "@/components/auth/Can";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrderStatus } from "@/lib/api/orders";
import type { Order, OrderStatusEnum } from "@/api/generated/model";

const ORDER_STATUSES: { value: OrderStatusEnum; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Only fetch orders if user is authenticated as admin
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user || user.role !== "admin") return;

    async function loadOrders() {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [user, isAuthLoading]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatusEnum
  ) => {
    setUpdatingOrderId(orderId);
    try {
      const updatedOrder = await updateOrderStatus(orderId, { status: newStatus });
      // Update local state with the response from the API
      setOrders(
        orders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert(
        "Unable to update order status. Please check with your administrator - the backend may need to add a PATCH endpoint to /api/v1/orders/{id}/ for order status updates."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  const getValidNextStatuses = (currentStatus: OrderStatusEnum): OrderStatusEnum[] => {
    const statusFlow: Record<OrderStatusEnum, OrderStatusEnum[]> = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    return statusFlow[currentStatus] || [];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isAuthLoading || isLoading) {
    return (
      <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Order Management
        </h1>
        <p className="text-brav-muted">Loading orders...</p>
      </section>
    );
  }

  // If user is not admin, show access denied
  if (!user || user.role !== "admin") {
    return (
      <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Order Management
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
          Order Management
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-brav-foreground mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-brav-md border border-brav-border bg-white px-3 py-2 text-sm font-medium text-brav-foreground focus:border-brav-primary focus:outline-none"
          >
            <option value="">All Orders</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-brav-lg border border-brav-border bg-white shadow-sm">
          <table className="min-w-full rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-brav-border text-brav-foreground">
                <th className="p-4 text-left">Order #</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const validNextStatuses = getValidNextStatuses(order.status);
                return (
                  <tr key={order.id} className="border-b border-brav-border hover:bg-brav-background/50">
                    <td className="p-4 font-medium text-brav-foreground">
                      {order.order_number}
                    </td>
                    <td className="p-4 text-brav-muted">Customer ID: {order.id.substring(0, 8)}...</td>
                    <td className="p-4 text-brav-muted">{formatDate(order.created_at)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-brav-foreground">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-brav-muted">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(order.id, e.target.value as OrderStatusEnum);
                            }
                          }}
                          disabled={!validNextStatuses.length || updatingOrderId === order.id}
                          className="rounded-brav-md border border-brav-border bg-white px-2 py-1 text-xs font-medium text-brav-foreground focus:border-brav-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Update Status</option>
                          {validNextStatuses.map((status) => {
                            const statusInfo = ORDER_STATUSES.find((s) => s.value === status);
                            return (
                              <option key={status} value={status}>
                                {statusInfo?.label}
                              </option>
                            );
                          })}
                        </select>
                        <button
                          type="button"
                          onClick={() => window.open(`/orders/${order.id}`, "_blank")}
                          className="rounded-brav-md bg-brav-secondary px-2 py-1 text-xs font-medium text-brav-foreground hover:bg-brav-secondary-hover text-center"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-brav-muted">
              {filterStatus
                ? `No orders with status "${filterStatus}"`
                : "No orders found"}
            </div>
          )}
        </div>
      </section>
    </Can>
    </ProtectedRoute>
  );
}