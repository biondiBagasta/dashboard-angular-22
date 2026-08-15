import { ProductData } from "./product"

export interface OrderItemsData {
	id: number
	order_id: number
	product_id: number
	selling_price: number
	discount: number
	sub_total: number
	quantity: number
	edges: {
		product: ProductData
	}
}