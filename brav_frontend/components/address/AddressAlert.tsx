"use client";

interface AddressAlertProps {
  message: {
    text: string;
    type: "success" | "error";
  } | null;
}

export default function AddressAlert({
  message,
}: AddressAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`mt-6 rounded-brav-md border p-4 text-sm ${
        message.type === "success"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message.text}
    </div>
  );
}