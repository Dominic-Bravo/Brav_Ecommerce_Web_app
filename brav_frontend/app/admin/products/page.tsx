"use client";

import { Can } from "@/components/auth/Can";
import AdminProductsPanel from "@/components/products/AdminProductsPanel";

export default function AdminProductsPage() {
  return (
    <Can permission="access_admin" fallback={null}>
      <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Product Management
        </h1>

        <AdminProductsPanel />
      </section>
    </Can>
  );
}
