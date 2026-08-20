import { ChangeDetectionStrategy, Component, computed, inject, signal, } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAppearance, TuiButton, TuiDialog, TuiInput, TuiNotification } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { OrderItemsBodyData, SelectedOrderProductData } from '../../interfaces/orders';
import { catchError, Subscription, switchMap } from 'rxjs';
import { AuthenticatedSignal } from '../../signals/authenticated-signal';
import { OrderService } from '../../services/order.service';
import { baseUrl, deformatToNumber, formatCurrencyMaskito } from '../../../utils/utils';
import { UtilsService } from '../../services/utils.service';
import { PageTitleComponent } from '../../components/template/page-title.component/page-title.component';
import { OrderProductSection } from './order-product-section/order-product-section';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog';
import { TuiButtonLoading } from '@taiga-ui/kit';

@Component({
  selector: 'app-order-create-page',
  imports: [
    TuiTable,
    TuiCardLarge,
    TuiAppearance,
    PageTitleComponent,
    OrderProductSection,
    TuiInput,
    FormsModule,
    TuiButton,
    TuiNotification,
    TuiDialog,
    ConfirmationDialog,
    TuiButtonLoading
  ],
  templateUrl: './order-create-page.html',
  styleUrl: './order-create-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCreatePage {

  selectedItemList$ = signal<SelectedOrderProductData[]>([])

  subscription = new Subscription();

  isLoadingSubmit$ = signal(false);

  authenticatedSignal = inject(AuthenticatedSignal)
  orderService = inject(OrderService)
  authenticatedUser$ = computed(() => this.authenticatedSignal.authenticatedUser$())
  utilsService = inject(UtilsService);

  isOpenedConfirmationDialog = false;

  fileUrl = `${baseUrl}/files/product/image/`

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  openConfirmationDialog(): void {
    this.isOpenedConfirmationDialog = true;
  }

  closeConfirmationDialog(): void {
    this.isOpenedConfirmationDialog = false;
  }

  calculateSubtotalAndUpdateSelectedItems (index: number): void {
    const currentData = this.selectedItemList$();

    const discount = deformatToNumber(currentData[index].discount);
    const selling_price = deformatToNumber(currentData[index].selling_price);
    const qty = currentData[index].quantity;

    const discountedPrice = selling_price * (discount / 100)
    const totalPrice = selling_price - discountedPrice

    const sub_total = totalPrice * qty

    const formattedSubtotal = formatCurrencyMaskito(sub_total)

    currentData[index].sub_total = formattedSubtotal

    this.selectedItemList$.set([...currentData])
  }

  calculateSubtotal(): string {
    const currentData = this.selectedItemList$();

    const reduceSubtotal = currentData.map(d => deformatToNumber(d.sub_total)).reduce((curr, val) => curr + val, 0)

    return formatCurrencyMaskito(reduceSubtotal)
  }

	decrementQty (index: number): void {
		const currentData = this.selectedItemList$();

		const currentQty = currentData[index].quantity;

		if(currentQty > 1) {
		  currentData[index].quantity = currentQty - 1;

		  this.calculateSubtotalAndUpdateSelectedItems(index)
		} else {
		  currentData.splice(index, 1)

		  this.selectedItemList$.set([...currentData])
		}
	}

	incrementQty = (index: number) => {
		const currentData = this.selectedItemList$();

		const currentQty = currentData[index].quantity;

		currentData[index].quantity = currentQty + 1;

		this.calculateSubtotalAndUpdateSelectedItems(index)
	}

  proceedCheckout(): void {
    this.isLoadingSubmit$.set(true);

    this.closeConfirmationDialog()

    const orderItemsBodyData: OrderItemsBodyData[] = this.selectedItemList$().map(d => {
      return { product_id: d.product_id, quantity: d.quantity, selling_price: deformatToNumber(d.selling_price), discount: deformatToNumber(d.discount) }
    });

    const checkoutSubscription = this.orderService.create({
      created_by: this.authenticatedUser$()!.id,
      items: orderItemsBodyData
    }).pipe(
      switchMap((response) => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.selectedItemList$.set([]);

          return this.utilsService.showInfoAlert("CREATE ORDER", response.message);
        } else {
          this.isLoadingSubmit$.set(false);

          return this.utilsService.showErrorAlert("ERROR", response.message);
        }
      }),
      catchError((e) => {
        this.isLoadingSubmit$.set(false);

        return this.utilsService.showErrorHttpMessageAlert(e);
      })
    ).subscribe();

    this.subscription.add(checkoutSubscription)
  }
}
