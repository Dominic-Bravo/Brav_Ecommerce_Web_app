"use client";

import { Can } from "@/components/auth/Can";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AdminDashboardPage() {
  return (
    <Can permission="access_admin" fallback={null}>
      <DashboardLayout>
        <section className="p-8">
          <h1 className="text-3xl font-bold text-brav-heading mb-6">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Products Stat */}
            <div className="rounded-brav-lg border border-brav-border bg-white p-6">
              <p className="text-sm text-brav-muted">Total Products</p>
              <h3 className="mt-2 text-3xl font-bold text-brav-foreground">0</h3>
            </div>

            {/* Total Customers Stat */}
            <div className="rounded-brav-lg border border-brav-border bg-white p-6">
              <p className="text-sm text-brav-muted">Total Customers</p>
              <h3 className="mt-2 text-3xl font-bold text-brav-foreground">0</h3>
            </div>

            {/* Total Orders Stat */}
            <div className="rounded-brav-lg border border-brav-border bg-white p-6">
              <p className="text-sm text-brav-muted">Total Orders</p>
              <h3 className="mt-2 text-3xl font-bold text-brav-foreground">0</h3>
            </div>

            {/* Total Sales Stat */}
            <div className="rounded-brav-lg border border-brav-border bg-white p-6">
              <p className="text-sm text-brav-muted">Total Sales</p>
              <h3 className="mt-2 text-3xl font-bold text-brav-foreground">$0.00</h3>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <section>
              <h2 className="text-xl font-semibold text-brav-heading mb-4">Recent Orders</h2>
              <div className="rounded-brav-lg border border-brav-border bg-white p-4">
                <p className="text-brav-muted text-sm">No orders yet</p>
              </div>
            </section>

            {/* Low Stock Products */}
            <section>
              <h2 className="text-xl font-semibold text-brav-heading mb-4">Low Stock Products</h2>
              <div className="rounded-brav-lg border border-brav-border bg-white p-4">
                <p className="text-brav-muted text-sm">No low-stock products</p>
              </div>
            </section>
          </div>
        </section>
      </DashboardLayout>
    </Can>
  );
}