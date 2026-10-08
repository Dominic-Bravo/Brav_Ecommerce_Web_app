"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileContent from "@/components/profile/ProfileContent";
import AddressContent from "@/components/address/AddressContent";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
      <AddressContent />
    </ProtectedRoute>
  );
}