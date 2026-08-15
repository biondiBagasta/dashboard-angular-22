export interface SupplierData {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  active: number;
  created_at: Date;
  updated_at: Date
}

export interface SupplierBody {
  name: string;
  address: string;
  phone_number: string;
  active: number;
}