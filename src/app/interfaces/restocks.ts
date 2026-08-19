import { Paginate } from "./paginate";
import { ProductData } from "./product";
import { RestockItemsData } from "./restock-items";
import { SupplierData } from "./supplier";
import { UserData } from "./user";

export interface RestocksData {
	id: number;
	restock_number: string;
	restock_date: Date
	supplier_id: number;
	sub_total: number;
	discount_total: number;
	grand_total: number;
	created_by: number;
	note: string | null;
	created_at: Date;
	updated_at: Date
 	edges: {
    	restock_items: RestockItemsData[]
    	user: UserData;
    	supplier: SupplierData
  	}
}

export interface RestockPaginate {
  data: RestocksData[]
  paginate: Paginate
}

export interface RestockBody {
	supplier_id: number;
	restock_date: Date;
	created_by: number;
	note: string | undefined;
	items: RestockItemsBodyData[]
}

export interface RestockItemsBodyData {
	product_id: number;
	quantity: number;
	purchase_price: number;
	discount: number;
}

export interface SelectedRestockProductData {
	product_id: number;
	product: ProductData;
	quantity: number;
	purchase_price: string;
	discount: string;
	sub_total: string
}
