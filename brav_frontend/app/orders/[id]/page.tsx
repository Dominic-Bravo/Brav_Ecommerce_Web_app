"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { useOrder } from "@/lib/api/orders";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const CURRENCY_CODE = "PHP";

/* Helper functions for status display */

function getStatusBadgeClass(status: string) {
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
}

function getStatusLabel(status: string) {
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
}

/**
 * Order Details page — displays a single order with items, quantities, and totals.
 *
 * - Requires authentication via ProtectedRoute
 * - Fetches the order using Orval useOrder hook (TanStack Query)
 * - Shows order number, date, shipping info, items, and status
 * - Includes navigation back to order history
 */
export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useOrder(orderId!);

  const router = useRouter();

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

  if (isLoading) {
    return (
      <ProtectedRoute>
        <section className="min-h-span bg-brav-secondary py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-brav-muted text-center">
                Loading order details...
              </p>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <section className="min-h-screen bg-brav-secondary py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 error-state">
              <svg
                className="error-state-icon mb-3"
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
              <p className="error-state-title">Order not found</p>
              <p className="error-state-description">
                {(error as Error).message}
              </p>
              <Button
                variant="secondary"
                onClick={() => refetch()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <section className="min-h-screen bg-brav-secondary py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl font-bold text-brav-heading text-center">
                Order not found
              </h1>
              <p className="mt-2 text-sm text-brav-muted text-center">
                The order you are looking for could not be loaded.
              </p>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className="bg-brav-secondary py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header with back navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <Link
                href="/orders"
                className="text-sm text-brav-primary hover:underline underline-opacity-24"
              >
                ← Back to Order History
              </Link>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/orders")}
                style={{ display: "none" }}
              >
                View Order History
              </Button>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-brav-lg border border-brav-border p-6 mb-8 shadow-sm">
            {/* Order info */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-4">
              <div>
                <p className="text-xs text-brav-muted font-medium">Order Number</p>
                <p className="text-sm font-medium text-brav-heading">#{order.order_number}</p>
              </div>
              <div>
                <p className="text-xs text-brav-muted font-medium">Date</p>
                <p className="text-sm font-medium text-brav-heading">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-brav-muted font-medium">Items</p>
                <p className="text-sm font-medium text-brav-heading">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-brav-muted font-medium">Total</p>
                <p className="text-sm font-medium text-brav-heading">
                  {formatMoney(order.total_amount)}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div className="mt-4">
              <span className={getStatusBadgeClass(order.status)}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          {/* Order items */}
          <div className="space-y-6">
            {order.items.map((item) => (
              <div className="flex items-center gap-4 p-3 rounded-brav-md border border-brav-background bg-brav-background" key={item.id}>
                <div className="h-12 w-12 rounded-brav-md bg-brav-secondary flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-brav-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2zm0 0l-3 3m3-3l3 3m-3-3V2M7 21h10a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 002 2v4a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brav-heading">
                    {item.product_details?.name || item.product}
                  </p>
                  <p className="text-xs text-brav-muted">
                    SKU: {item.product_details?.sku || "N/A"}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">
                    {formatMoney(item.unit_price)}
                  </p>
                  <p className="text-xs text-brav-muted">
                    qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order totals */}
          <div className="mt-8 pt-8 border-t border-brav-border">
            <div className="flex justify-between">
              <p className="text-sm text-brav-muted">Total Items</p>
              <p className="font-medium text-brav-heading">{order.items.length} item(s)</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-brav-muted">Total Amount</p>
              <p className="font-medium text-brav-xl text-brav-heading">
                {formatMoney(order.total_amount)}
              </p>
            </div>
            <div className="flex justify-between mt-4">
              <p className="text-sm text-brav-muted">Status</p>
              <span className={getStatusBadgeClass(order.status)}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}