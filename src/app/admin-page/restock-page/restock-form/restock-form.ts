import { ChangeDetectionStrategy, Component, inject, input, model, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { baseUrl, ControlsOf, deformatToNumber, formatCurrencyMaskito, formatPercentMaskito, maskitoCurrencyOptions, maskitoPercentOptions } from '../../../../utils/utils';
import { RestockFormControls } from '../restock-page';
import { SelectedRestockProductData } from '../../../interfaces/restocks';
import { ProductData, ProductPaginate } from '../../../interfaces/product';
import { Subscription, tap } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { TuiButton, TuiCheckbox, TuiInput, TuiLoader, TuiNotification } from '@taiga-ui/core';
import { InputDateComponent } from '../../../components/input-date.component/input-date.component';
import { SelectFieldComponent } from '../../../components/select-field.component/select-field.component';
import { TextareaFieldComponent } from '../../../components/textarea-field.component/textarea-field.component';
import { SelectItem } from '../../../interfaces/select-item';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAvatar } from '@taiga-ui/kit';
import { CurrencyPipe } from '@angular/common';
import { InputSearchComponent } from '../../../components/input-search.component/input-search.component';
import { MaskitoDirective } from '@maskito/angular';

@Component({
  selector: 'app-restock-form',
  imports: [
    ReactiveFormsModule,
    TuiLoader,
    TuiButton,
    InputDateComponent,
    SelectFieldComponent,
    TextareaFieldComponent,
    TuiTable,
    TuiAvatar,
    TuiCheckbox,
    CurrencyPipe,
    InputSearchComponent,
    TuiNotification,
    MaskitoDirective,
    TuiInput,
    FormsModule,
  ],
  templateUrl: './restock-form.html',
  styleUrl: './restock-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestockForm {
  formGroup = input.required<FormGroup<ControlsOf<RestockFormControls>>>()
  isLoadingSubmit = input.required<boolean>()
  onSubmit = output<void>()
  selectedItemList = model.required<SelectedRestockProductData[]>()
  onClose = output<void>()
  title = input.required<string>()
  supplierSelectList = input.required<SelectItem[]>()

  paginationProductData$ = signal<ProductPaginate | null>(null)

  searchControl = new FormControl<string | null>(null)

  subscription = new Subscription();

  productService = inject(ProductService)

  isLoadingSearchProduct$ = signal(false)

  fileUrl = `${baseUrl}/files/product/image/`

  maskitoCurrency = maskitoCurrencyOptions;
  maskitoPercents = maskitoPercentOptions

  ngOnInit(): void {
    this.search();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(): void {
    this.isLoadingSearchProduct$.set(true);
    const term = this.searchControl.value ?? ""
    const searchSubscription = this.productService.searchPaginateLimitFive(1, term).pipe(
      tap(response => {
        this.paginationProductData$.set(response);
        this.isLoadingSearchProduct$.set(false);
      })
    ).subscribe();

    this.subscription.add(searchSubscription)
  }

  checkIfProductSelected(productId: number): boolean {
    const currentSelectedItemList = this.selectedItemList()

    const findIndex = currentSelectedItemList.findIndex(d => d.product_id == productId);

    if(findIndex == -1) {
      return false
    } else {
      return true
    }
  }

  selectProductItem (product: ProductData): void {

    if(!this.checkIfProductSelected(product.id)) {
      const currentSelectedItems = this.selectedItemList();

      const findIndex = currentSelectedItems.findIndex(d => d.product_id == product.id)

      if(findIndex == -1) {
        const newSelectedItems: SelectedRestockProductData = {
          product_id: product.id,
          product: product,
          quantity: 1,
          purchase_price: formatCurrencyMaskito(product.purchase_price),
          discount: formatPercentMaskito(0),
          sub_total: formatCurrencyMaskito(product.purchase_price)
        }

        currentSelectedItems.push(newSelectedItems)

        this.selectedItemList.set(currentSelectedItems)
      }
    }
  }

  calculateSubtotalAndUpdateSelectedItems (index: number): void {
    const currentData = this.selectedItemList();

    const discount = deformatToNumber(currentData[index].discount);
    const purchase_price = deformatToNumber(currentData[index].purchase_price);
    const qty = currentData[index].quantity;

    const discountedPrice = purchase_price * (discount / 100)
    const totalPrice = purchase_price - discountedPrice

    const sub_total = totalPrice * qty

    const formattedSubtotal = formatCurrencyMaskito(sub_total)

    currentData[index].sub_total = formattedSubtotal

    this.selectedItemList.set([...currentData])
  }

  decrementQty (index: number): void {
    const currentData = this.selectedItemList();

    const currentQty = currentData[index].quantity;

    if(currentQty > 1) {
      currentData[index].quantity = currentQty - 1;

      this.calculateSubtotalAndUpdateSelectedItems(index)
    } else {
      currentData.splice(index, 1)

      this.selectedItemList.set([...currentData])
    }
  }

  incrementQty(index: number): void {
    const currentData = this.selectedItemList();

    const currentQty = currentData[index].quantity;

    currentData[index].quantity = currentQty + 1;

    this.calculateSubtotalAndUpdateSelectedItems(index)
  }

  updatePurchasePrice (index: number, value: string): void {
  	const currentData = this.selectedItemList();

  	currentData[index].purchase_price = value;

  	this.calculateSubtotalAndUpdateSelectedItems(index)
  }

  updateDiscount (index: number, value: string): void {
  	const currentData = this.selectedItemList();

  	currentData[index].discount = value;

  	this.calculateSubtotalAndUpdateSelectedItems(index);
  }
}
