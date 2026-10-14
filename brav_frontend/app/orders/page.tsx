"use client";

import { useRouter } from "next/navigation";

import { useOrders } from "@/lib/api/orders";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/Button";

const CURRENCY_CODE = "PHP";

/**
 * Order History page — displays the authenticated user's orders.
 *
 * - Requires authentication via ProtectedRoute.
 * - Fetches orders using Orval-generated useOrders hook (TanStack Query).
 * - Displays order number, date, total, and status.
 * - Each order links to the order details page.
 */
export default function OrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading, error, refetch } = useOrders();

  const formatMoney = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: CURRENCY_CODE,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "status-badge status-badge-success";
      case "cancelled":
        return "status-badge status-badge-danger";
      case "pending":
        return "status-badge status-badge-warning";
      case "processing":
      case "shipped":
        return "status-badge status-badge-neutral";
      default:
        return "status-badge status-badge-neutral";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-brav-background py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-brav-heading">Order History</h1>
              <p className="mt-1 text-sm text-brav-muted">
                View and track your past orders.
              </p>
            </div>
            <div className="empty-state">
              <svg
                className="empty-state-icon mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2zm0 0l-3 3m3-3l3 3m-3-3V2M7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z"
                />
              </svg>
              <p className="empty-state-description">
                Loading orders...
              </p>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-brav-background py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-brav-heading">Order History</h1>
            </div>
            <div className="error-state">
              <svg
                className="error-state-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="error-state-title">Failed to load orders</p>
              <p className="error-state-description">
                {(error as Error).message}
              </p>
              <div className="flex gap-3">
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-brav-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brav-heading">Order History</h1>
            <p className="mt-1 text-sm text-brav-muted">
              View and track your past orders.
            </p>
          </div>

          {orders && orders.length === 0 ? (
            <div className="empty-state">
              <svg
                className="empty-state-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2zm0 0l-3 3m3-3l3 3m-3-3V2M7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z"
                />
              </svg>
              <h2 className="empty-state-title">No orders yet</h2>
              <p className="empty-state-description">
                When you place an order, it will appear here.
              </p>
              <Button onClick={() => router.push("/products")} variant="primary">
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders?.map((order) => (
                <div
                  key={order.id}
                  className="rounded-brav-lg border border-brav-border bg-white p-6 hover:border-brav-primary transition-colors"
                  onClick={() => router.push(`/orders/${order.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-brav-md bg-brav-secondary">
                        <svg
                          className="h-8 w-8 text-brav-muted"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2zm0 0l-3 3m3-3l3 3m-3-3V2M7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-brav-heading">
                          Order #{order.order_number}
                        </p>
                        <p className="text-sm text-brav-muted">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:ml-auto">
                      <div className="text-right">
                        <p className="font-semibold text-brav-heading">
                          {formatMoney(order.total_amount)}
                        </p>
                        <p className="text-sm text-brav-muted">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <span className={getStatusBadgeClass(order.status)}>
                        {getStatusLabel(order.status)}
                      </span>

                      <svg
                        className="h-5 w-5 text-brav-muted flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}