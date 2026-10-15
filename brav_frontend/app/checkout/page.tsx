"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/lib/api/cart";
import useCartStore from "@/store/useCartStore";
import { useCheckout, getAddressesApi } from "@/lib/api/orders";
import Button from "@/components/ui/Button";
import type { Address } from "@/types/address";
import type {
  CheckoutRequest,
  Order,
} from "@/api/generated/model";
import AddressForm from "@/components/address/AddressForm";

const CURRENCY_CODE = "PHP";

/**
 * Checkout page.
 *
 * Per CLAUDE.md rules, this page requires authentication.
 * The ProtectedRoute component handles the auth redirect.
 *
 * Flow:
 *   1. Fetch user's saved addresses
 *   2. Display shipping address form + payment method
 *   3. Show order summary from cart
 *   4. Submit to backend, clear cart, show confirmation
 */
export default function CheckoutPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Fetch user's saved addresses
  const [addressesData, setAddressesData] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Form state (match CheckoutRequest field names)
  const [form, setForm] = useState({
    address_id: "",
    addressType: "shipping",
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    payment_method: "",
    coupon_code: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  // Cart data for order summary (source of truth)
  const { data: cart, isLoading: cartIsLoading, error: cartError } = useCart();
  const { items: storeItems } = useCartStore();

  // Checkout mutation (invalidates cart + orders queries on success)
  const { mutate, isPending } = useCheckout();

  // Format money
  const formatMoney = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "0.00";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: CURRENCY_CODE,
    }).format(num);
  };

  // Compute order summary from store items (source of truth for UI)
  const cartItemsArray = storeItems ?? [];

  // Type-annotated reduce to avoid implicit 'any' warnings
  const totalItemQty = cartItemsArray.reduce(
    (count: number, item: { quantity?: number }): number =>
      count + (item.quantity ?? 1),
    0
  );
  const subtotal = cartItemsArray.reduce(
    (sum: number, item: { price_at_purchase?: number, quantity?: number }): number =>
      sum + (item.price_at_purchase ?? 0) * (item.quantity ?? 1),
    0
  );
  const cartTotal =
    cart?.total_price ?? formatMoney(subtotal);

  // Redirect to cart if empty (useEffect to prevent render-time navigation)
  useEffect(() => {
    if (cartItemsArray.length === 0) {
      router.push("/cart");
    }
  }, [cartItemsArray.length, router]);

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAddressesApi();
        setAddressesData(data);

        // Auto-select the default address if available
        const defaultAddress = data.find((addr) => addr.is_default);
        if (defaultAddress) {
          setForm((prev) => ({
            ...prev,
            address_id: defaultAddress.id,
          }));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load addresses";
        console.error("Failed to load addresses:", message);
      }
    })();
  }, []);

  // Handle address saved from AddressForm
  const handleAddressSaved = () => {
    setShowAddressForm(false);
    // Reload addresses
    getAddressesApi().then(setAddressesData).catch(console.error);
  };

  // If not authenticated yet, let ProtectedRoute handle the redirect
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brav-secondary">
        <p className="text-brav-muted">Checking authentication...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Handle address change (select from saved or fill manual)
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const name = (e.target.name as keyof typeof form) || "";
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? "" : value,
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      payment_method: e.target.value,
    }));
  };

  // Handle coupon code change
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      coupon_code: e.target.value,
    }));
  };

  // Submit checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields before submitting
    if (!form.address_id) {
      alert("Please select or create a shipping address before placing your order.");
      return;
    }

    if (!form.payment_method) {
      alert("Please select a payment method before placing your order.");
      return;
    }

    mutate(form, {
      onSuccess: (data) => {
        setOrder(data);
        setShowConfirmation(true);
        // Reset form
        setForm({
          address_id: "",
          addressType: "shipping",
          full_name: "",
          phone: "",
          street_address: "",
          city: "",
          state: "",
          postal_code: "",
          country: "",
          payment_method: "",
          coupon_code: "",
        });
      },
      onError: (err) => {
        // Show error to user
        alert(err.message || "Checkout failed. Please try again.");
        console.error("Checkout error:", err);
      },
    });
  };

  // If cart is still loading
  if (cartIsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brav-secondary py-12">
        <p className="text-brav-muted">Loading cart...</p>
      </main>
    );
  }

  if (cartError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brav-secondary py-12">
        <p className="text-brav-error">
          Error loading cart: {(cartError as Error).message}
        </p>
        <Button
          onClick={() => router.push("/cart")}
          variant="secondary"
          className="mt-4"
        >
          Return to Cart
        </Button>
      </main>
    );
  }

  // If cart is empty, redirect back
  if (cartItemsArray.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brav-secondary py-12">
        <p className="text-brav-muted">Your cart is empty.</p>
        <Button
          onClick={() => router.push("/cart")}
          variant="secondary"
          className="mt-4"
        >
          Return to Cart
        </Button>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="bg-brav-background min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 border-brav-border border-b brav-border pb-8">
            <h1 className="text-3xl font-bold text-brav-heading">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-brav-muted">
              Please review your order and provide shipping & payment information.
            </p>
          </div>

          {/* Show confirmation if order was created */}
          {showConfirmation && order ? (
            <div className="bg-white rounded-brav-lg border border-brav-border p-6 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold text-brav-foreground mb-4">
                Order Confirmed
              </h2>

              <div className="space-y-4">
                <p className="text-brav-muted">
                  <strong>Order Number:</strong> {order.order_number}
                </p>
                <p className="text-brav-muted">
                  <strong>Total:</strong> {formatMoney(order.total_amount)}
                </p>
                <p className="text-brav-muted">
                  <strong>Items:</strong> {totalItemQty} item(s)
                </p>
                <p className="text-brav-muted">
                  Your order has been successfully placed. An order confirmation
                  email will be sent to your registered email address.
                </p>
              </div>

              <Button
                onClick={() => {
                  router.push("/orders");
                  setShowConfirmation(false);
                  setOrder(null);
                }}
                variant="primary"
                className="w-full"
              >
                View Order History
              </Button>
            </div>
          ) : (
            /* Checkout Form */
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              {/* Step 1: Shipping Address */}
              <fieldset>
                <legend className="text-sm font-medium text-brav-foreground mb-3">
                  Shipping Address
                </legend>

                {showAddressForm ? (
                  <div className="mb-4">
                    <AddressForm
                      address={null}
                      onSaved={handleAddressSaved}
                      onCancel={() => setShowAddressForm(false)}
                      onMessage={(msg) => {
                        if (msg) {
                          console.error("Address form error:", msg.text);
                        }
                      }}
                      bare={true}
                    />
                  </div>
                ) : addressesData.length > 0 ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-brav-foreground mb-1">
                      Select saved address
                    </label>
                    <select
                      name="address_id"
                      value={form.address_id}
                      onChange={handleAddressChange}
                      className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
                    >
                      <option value="">-- Select an address --</option>
                      {addressesData.map((addr) => (
                        <option
                          key={addr.id}
                          value={addr.id}
                        >
                          {addr.full_name}
                          {" - "}{addr.street_address}
                          {addr.city}, {addr.state} {addr.postal_code}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* No saved addresses - prompt to create one */
                  <div className="border border-dashed border-brav-border rounded-brav-md p-6 text-center">
                    <p className="text-sm text-brav-muted mb-4">
                      No saved addresses found. You need to create a shipping address.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      variant="primary"
                      size="md"
                    >
                      Add Shipping Address
                    </Button>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-brav-foreground mb-1">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={form.addressType}
                    onChange={handleAddressChange}
                    className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
                  >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
              </fieldset>

              {/* Step 2: Payment Information */}
              <fieldset>
                <legend className="text-sm font-medium text-brav-foreground mb-3">
                  Payment Information
                </legend>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-brav-foreground mb-1">
                    Payment Method
                  </label>
                  <select
                    name="payment_method"
                    value={form.payment_method}
                    onChange={handlePaymentMethodChange}
                    className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brav-foreground mb-1">
                    Coupon Code (optional)
                  </label>
                  <input
                    type="text"
                    name="coupon_code"
                    value={form.coupon_code}
                    onChange={handleCouponChange}
                    className="w-full rounded-brav-md border border-brav-border px-4 py-2.5 text-sm outline-none focus:border-brav-primary"
                    placeholder="Enter coupon code"
                    disabled={isPending}
                  />
                </div>
              </fieldset>

              {/* Step 3: Order Summary */}
              <fieldset>
                <legend className="text-sm font-medium text-brav-foreground mb-3">
                  Order Summary
                </legend>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-brav-muted">
                      Items
                    </p>
                    <p className="text-2xl font-bold text-brav-heading">
                      {totalItemQty}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brav-muted">
                      Subtotal
                    </p>
                    <p className="text-2xl font-bold text-brav-heading">
                      {formatMoney(subtotal)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-brav-border">
                  <p className="text-sm text-brav-muted">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-brav-primary">
                    {formatMoney(cartTotal)}
                  </p>
                </div>
              </fieldset>

              {/* Submit button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 px-6 text-lg font-medium"
                >
                  {isPending
                    ? "Processing..."
                    : "Place Order"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}