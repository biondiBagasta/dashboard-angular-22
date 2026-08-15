import { ProductData } from "./product"

export interface RestockItemsData {
	id: number
	restock_id: number
	product_id: number
	quantity: number
	purchase_price: number
	discount: number
	sub_total: number
	edges: {
		product: ProductData
	}
}