"use client";

import { useCallback, useState } from "react";

import { useAuth } from "@/context/AuthContext";

import ProfileHeader from "./ProfileHeader";
import ProfileAlert from "./ProfileAlert";
import AccountInfoForm from "./AccountInfoForm";
import ProfileInfoForm from "./ProfileInfoForm";
import DeleteAccountSection from "./DeleteAccountSection";

interface ProfileMessage {
  text: string;
  type: "success" | "error";
}

export default function ProfileContent() {
  const {
    user,
    setUser,
    logout,
  } = useAuth();

  const [message, setMessage] =
    useState<ProfileMessage | null>(null);

  // Stable function reference.
  // It will not be recreated on every render.
  const handleMessage = useCallback(
    (newMessage: ProfileMessage | null) => {
      setMessage(newMessage);
    },
    []
  );

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-brav-secondary p-8">
      <div className="mx-auto max-w-4xl">
        <ProfileHeader user={user} />

        <ProfileAlert message={message} />

        <AccountInfoForm
          user={user}
          onUserUpdated={setUser}
          onMessage={handleMessage}
        />

        <ProfileInfoForm
          onMessage={handleMessage}
        />

        <DeleteAccountSection
          onDeleted={logout}
          onMessage={handleMessage}
        />
      </div>
    </main>
  );
}