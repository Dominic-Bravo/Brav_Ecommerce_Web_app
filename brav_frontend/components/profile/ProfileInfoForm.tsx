"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  getProfileApi,
  updateProfileApi,
} from "@/lib/api/auth";
import type { UserProfile } from "@/types/auth";

interface ProfileInfoFormProps {
  onMessage: (
    message: {
      text: string;
      type: "success" | "error";
    } | null
  ) => void;
}

export default function ProfileInfoForm({
  onMessage,
}: ProfileInfoFormProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [avatar, setAvatar] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);

        const data = await getProfileApi();

        setProfile(data);
        // Only set avatar to what this specific user returned from the API
        setAvatar(data.avatar || "");
        setDateOfBirth(data.date_of_birth || "");
        setGender(data.gender || "");
        setImageError(false);
      } catch (error) {
        onMessage({
          text:
            error instanceof Error
              ? error.message
              : "Failed to load profile.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [onMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsUpdating(true);
    onMessage(null);

    try {
      const updatedProfile = await updateProfileApi({
        avatar,
        date_of_birth: dateOfBirth,
        gender,
      });

      setProfile(updatedProfile);

      setAvatar(updatedProfile.avatar || "");
      setDateOfBirth(updatedProfile.date_of_birth || "");
      setGender(updatedProfile.gender || "");
      setImageError(false);

      onMessage({
        text: "Profile information updated successfully.",
        type: "success",
      });
    } catch (error) {
      onMessage({
        text:
          error instanceof Error
            ? error.message
            : "Failed to update profile.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <section className="mt-6 rounded-brav-lg border border-brav-border bg-white p-6 shadow-sm">
        <p className="text-sm text-brav-muted">
          Loading profile information...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-brav-lg border border-brav-border bg-white p-6 shadow-sm">
      <div className="border-b border-brav-border pb-4">
        <h2 className="text-xl font-semibold text-brav-foreground">
          Extended Profile Information
        </h2>

        <p className="text-xs text-brav-muted">
          Manage additional profile information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* User-Specific Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-brav-border bg-gray-100 flex items-center justify-center">
            {avatar && !imageError ? (
              <img
                src={avatar}
                alt="User Avatar"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              /* Generic Neutral Placeholder Icon */
              <svg
                className="h-8 w-8 text-brav-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-brav-foreground"
            >
              Avatar URL
            </label>

            <input
              id="avatar"
              type="text"
              placeholder="https://example.com/avatar.jpg"
              value={avatar}
              onChange={(event) => {
                setAvatar(event.target.value);
                setImageError(false);
              }}
              className="mt-1 block w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:border-brav-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium text-brav-foreground"
            >
              Date of Birth
            </label>

            <input
              id="date_of_birth"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="mt-1 block w-full rounded-brav-md border border-brav-border p-2.5 text-sm focus:border-brav-primary focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-brav-foreground"
            >
              Gender
            </label>

            <select
              id="gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              className="mt-1 block w-full rounded-brav-md border border-brav-border bg-white p-2.5 text-sm focus:border-brav-primary focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isUpdating || !profile}
            className="rounded-brav-md bg-brav-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brav-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Saving Profile..." : "Update Profile Info"}
          </button>
        </div>
      </form>
    </section>
  );
} 