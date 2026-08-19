import { OrderItemsData } from "./order-items";
import { Paginate } from "./paginate";
import { ProductData } from "./product";
import { UserData } from "./user";

export interface OrdersData {
	id: number;
	order_number: string;
	sub_total: number;
	discount_total?: number;
	grand_total: number;
	created_by: number;
	created_at: Date
	updated_at: Date
	edges: {
		user: UserData
		order_items: OrderItemsData[]
	}
}

export interface OrdersBody {
	created_by: number
	items: OrderItemsBodyData[]
}

export interface OrdersPaginate {
	data: OrdersData[]
	paginate: Paginate
}

export interface OrderItemsBodyData {
	product_id: number
	quantity: number
	selling_price: number
	discount: number
}

export interface SelectedOrderProductData {
	product_id: number;
	product: ProductData;
	quantity: number;
	selling_price: string;
	discount: string;
	sub_total: string
}
