"use client";

import { Can } from "@/components/auth/Can";
import AdminCategoriesPanel from "@/components/products/AdminCategoriesPanel";

export default function AdminCategoriesPage() {
  return (
    <Can permission="access_admin" fallback={null}>
      <section className="p-8">
        <h1 className="text-3xl font-bold text-brav-heading mb-6">
          Category Management
        </h1>

        <AdminCategoriesPanel />
      </section>
    </Can>
  );
}
