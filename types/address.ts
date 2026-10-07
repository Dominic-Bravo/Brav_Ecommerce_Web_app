export type AddressType = "shipping" | "billing";

export interface Address {
  id: string;
  type: AddressType;
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressPayload {
  type: AddressType;
  full_name: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export type UpdateAddressPayload =
  Partial<CreateAddressPayload>;