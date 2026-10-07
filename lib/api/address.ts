import { apiFetch } from "./client";

import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "@/types/address";

function getErrorMessage(
  data: unknown,
  fallback: string
): string {
  if (
    typeof data === "object" &&
    data !== null
  ) {
    const errorData = data as {
      detail?: string;
      message?: string;
    };

    return (
      errorData.detail ||
      errorData.message ||
      fallback
    );
  }

  return fallback;
}

/**
 * Get all addresses for the current user.
 */
// GET all
export async function getAddressesApi(): Promise<Address[]> {
  const response = await apiFetch(
    "/v1/users/addresses/"
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to fetch addresses."
      )
    );
  }

  return data.data;
}

/**
 * Get one address.
 */
export async function getAddressApi(
  id: string
): Promise<Address> {
  const response = await apiFetch(
    `/v1/users/addresses/${id}/`
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to fetch address."
      )
    );
  }

  return data;
}

/**
 * Create an address.
 */
export async function createAddressApi(
  payload: CreateAddressPayload
): Promise<Address> {
  const response = await apiFetch(
    "/v1/users/addresses/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to create address."
      )
    );
  }

  return data.data;
}

/**
 * Update an address.
 */
export async function updateAddressApi(
  id: string,
  payload: UpdateAddressPayload
): Promise<Address> {
  const response = await apiFetch(
    `/v1/users/addresses/${id}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to update address."
      )
    );
  }

  return data.data;
}

/**
 * Delete one address.
 */
export async function deleteAddressApi(
  id: string
): Promise<void> {
  const response = await apiFetch(
    `/v1/users/addresses/${id}/`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Failed to delete address."
      )
    );
  }
}

/**
 * Delete multiple addresses.
 *
 * The backend only provides:
 * DELETE /addresses/{id}/
 *
 * Therefore we send one request for each selected address.
 */
export async function deleteAddressesApi(
  ids: string[]
) {
  const results = await Promise.allSettled(
    ids.map((id) => deleteAddressApi(id))
  );

  const successful = results.filter(
    (result) => result.status === "fulfilled"
  ).length;

  const failed = results.filter(
    (result) => result.status === "rejected"
  ).length;

  return {
    successful,
    failed,
  };
}