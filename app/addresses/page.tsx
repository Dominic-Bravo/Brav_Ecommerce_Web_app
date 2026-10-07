"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddressContent from "@/components/address/AddressContent";

export default function AddressesPage() {
  return (
    <ProtectedRoute>
      <AddressContent />
    </ProtectedRoute>
  );
}