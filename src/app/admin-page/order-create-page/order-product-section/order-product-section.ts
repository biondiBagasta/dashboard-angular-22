import { Component, inject, model, signal } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAppearance, TuiLoader } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { InputSearchComponent } from '../../../components/input-search.component/input-search.component';
import { TuiAvatar } from '@taiga-ui/kit';
import { CurrencyPipe } from '@angular/common';
import { SelectedOrderProductData } from '../../../interfaces/orders';
import { ProductData, ProductPaginate } from '../../../interfaces/product';
import { Subscription, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { baseUrl, formatCurrencyMaskito, formatPercentMaskito } from '../../../../utils/utils';

@Component({
  selector: 'app-order-product-section',
  imports: [
    TuiTable,
    TuiLoader,
    TuiCardLarge,
    TuiAppearance,
    InputSearchComponent,
    TuiAvatar,
    CurrencyPipe
  ],
  templateUrl: './order-product-section.html',
  styleUrl: './order-product-section.css',
})
export class OrderProductSection {
  selectedItemList = model.required<SelectedOrderProductData[]>()

  productPaginationData$ = signal<ProductPaginate | null>(null)

  subscription = new Subscription()

  searchControl = new FormControl<string | null>(null)

  productService = inject(ProductService)

  isLoadingTable$ = signal(true);

  fileUrl = `${baseUrl}/files/product/image/`

  ngOnInit(): void {
    this.searchProduct();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchProduct(): void {
    this.isLoadingTable$.set(true);
    const term = this.searchControl.value ?? ''
    const searchSubscription = this.productService.searchPaginate(1, term).pipe(
      tap(response => {
        this.productPaginationData$.set(response);
        this.isLoadingTable$.set(false);
      })
    ).subscribe();

    this.subscription.add(searchSubscription)
  }

  selectProductItem(product: ProductData): void {

    const currentSelectedItems = this.selectedItemList()

    const findIndex = currentSelectedItems.findIndex(d => d.product_id == product.id)

    if(findIndex == -1 && product.stock! > 0) {
      const newSelectedItems: SelectedOrderProductData = {
        product_id: product.id,
        product: product,
        quantity: 1,
        selling_price: formatCurrencyMaskito(product.purchase_price),
        discount: formatPercentMaskito(0),
        sub_total: formatCurrencyMaskito(product.purchase_price)
      }

      currentSelectedItems.push(newSelectedItems)

      this.selectedItemList.set([...currentSelectedItems])
    }
  }

	checkIfProductIsAlreadySelected (productId: number): boolean {
		const currentSelectedData = this.selectedItemList()

		const findIndex = currentSelectedData.findIndex((d) => d.product_id == productId)

		if(findIndex == -1) {
		return false;
		} else {
		return true;
		}
	}
}
