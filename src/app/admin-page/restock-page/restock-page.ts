import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { PageTitleComponent } from '../../components/template/page-title.component/page-title.component';
import { SupplierSection } from "./supplier-section/supplier-section";
import { SupplierData } from '../../interfaces/supplier';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticatedSignal } from '../../signals/authenticated-signal';
import { RestockService } from '../../services/restock.service';
import { SelectItem } from '../../interfaces/select-item';
import { RestockItemsBodyData, RestockPaginate, RestocksData, SelectedRestockProductData } from '../../interfaces/restocks';
import { baseUrl, ControlsOf, deformatToNumber, formatCurrencyMaskito, formatPercentMaskito } from '../../../utils/utils';
import { catchError, Subscription, switchMap, tap } from 'rxjs';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk/date-time';
import { UtilsService } from '../../services/utils.service';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAvatar, TuiPagination } from '@taiga-ui/kit';
import { TuiAppearance, TuiButton, TuiDialog, TuiLoader, TuiNotification } from '@taiga-ui/core';
import { DaterangeFilterFieldComponent } from '../../components/daterange-filter-field.component/daterange-filter-field.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DeleteDialog } from '../../components/delete-dialog/delete-dialog';
import { RestockForm } from './restock-form/restock-form';
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog';

export interface RestockFormControls {
  supplier: SelectItem | null;
	restock_date: TuiDay | null;
	note: string | null;
}

@Component({
  selector: 'app-restock-page',
  imports: [
    TuiCardLarge,
    PageTitleComponent,
    SupplierSection,
    TuiTable,
    TuiPagination,
    TuiNotification,
    TuiButton,
    DaterangeFilterFieldComponent,
    TuiLoader,
    DatePipe,
    CurrencyPipe,
    TuiDialog,
    TuiAvatar,
    DeleteDialog,
    RestockForm,
    TuiAppearance,
    ConfirmationDialog
  ],
  templateUrl: './restock-page.html',
  styleUrl: './restock-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestockPage {

  formBuilder = inject(FormBuilder)
  restockService = inject(RestockService)
  utilsService = inject(UtilsService)

  authenticatedSignal = inject(AuthenticatedSignal);
  authetenticatedUser$ = computed(() => this.authenticatedSignal.authenticatedUser$())

  supplierList$ = signal<SupplierData[]>([]);

  supplierSelectList$ = computed<SelectItem[]>(() =>
    this.supplierList$().map(data => ({
      id: data.id,
      name: data.name,
    }))
  );
  selectedItemsList$ = signal<SelectedRestockProductData[]>([])

  isOpenedCreateDialog = false;
  isOpenedEditDialog = false;
  isOpenedDeleteDialog = false;

  isOpenedDetailDialog = false;

  paginationData$ = signal<RestockPaginate | null>(null)
  selectedData$ = signal<RestocksData | null>(null)

  searchDateRangeControl = new FormControl<TuiDayRange | null>(null);

  restockForm = this.formBuilder.group<ControlsOf<RestockFormControls>>({
    supplier: this.formBuilder.control(null, Validators.required),
    restock_date: this.formBuilder.control(null, Validators.required),
    note: this.formBuilder.control(null, Validators.required)
  });

  subscription = new Subscription()

  isLoadingTable$ = signal(true)
  isLoadingSubmit$ = signal(false);

  fileUrl = `${baseUrl}/files/product/image/`

  ngOnInit(): void {
    this.search(0)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(index: number): void {
    this.isLoadingTable$.set(true);
    const page = index + 1;

    const fromDate = this.searchDateRangeControl.value?.from.toLocalNativeDate() ?? new Date();
    const toDate = this.searchDateRangeControl.value?.to.toLocalNativeDate() ?? new Date()

    const searchSubscription = this.restockService.searchPaginate(page,
      fromDate, toDate
    ).pipe(
      tap(data => {
        this.paginationData$.set(data);
        this.isLoadingTable$.set(false);
      }),
      catchError((e) => {
        this.isLoadingTable$.set(false);
        return this.utilsService.showErrorHttpMessageAlert(e);
      }),
    ).subscribe();

    this.subscription.add(searchSubscription);
  }

  refresh(): void {
    // this.searchDateRangeControl.reset();
    this.search(0);
  }

  openCreateDialog(): void {
    this.selectedItemsList$.set([])
    this.restockForm.reset();
    this.isOpenedCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.isOpenedCreateDialog = false;
  }

  createData(): void {
    this.closeConfirmationDialogCreate()
    this.isLoadingSubmit$.set(true);

    const supplier = this.restockForm.controls.supplier.value!;
    const restockDate = this.restockForm.controls.restock_date.value!.toLocalNativeDate();
    const note = this.restockForm.controls.note.value ?? undefined;

    const items: RestockItemsBodyData[] = this.selectedItemsList$().map((d) => {
      return { product_id: d.product_id, quantity: d.quantity,
        purchase_price: deformatToNumber(d.purchase_price),
        discount: deformatToNumber(d.discount)
      }
    })

    const createSubscription = this.restockService.create({
      supplier_id: supplier.id,
      restock_date: restockDate,
      note: note,
      items: items,
      created_by: this.authetenticatedUser$()!.id
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.selectedItemsList$.set([])
          this.restockForm.reset();
          this.refresh();
          this.closeCreateDialog();

          return this.utilsService.showInfoAlert('CREATE', response.message);
        } else {
          this.isLoadingSubmit$.set(false);
          return this.utilsService.showErrorAlert('ERROR', response.message);
        }
      }),
      catchError((e) => {
        this.isLoadingSubmit$.set(false);

        return this.utilsService.showErrorHttpMessageAlert(e)
      })
    ).subscribe();

    this.subscription.add(createSubscription);
  }

  openEditDialog(data: RestocksData): void {
    this.selectedData$.set(data);

    const parsedRestockDate = new Date(data.restock_date)

    this.restockForm.patchValue({
      supplier: data.edges.supplier,
      restock_date: new TuiDay(parsedRestockDate.getFullYear(), parsedRestockDate.getMonth(), parsedRestockDate.getDay()),
      note: data.note,
    });

    const selectedItemList: SelectedRestockProductData[] = data.edges.restock_items.map((d) => {
      const selectedItemData: SelectedRestockProductData = {
        product_id: d.product_id,
        product: d.edges.product,
        quantity: d.quantity,
        purchase_price: formatCurrencyMaskito(d.purchase_price),
        discount: formatPercentMaskito(d.discount ?? 0),
        sub_total: formatCurrencyMaskito(d.sub_total)
      }

      return selectedItemData
    });

    this.selectedItemsList$.set(selectedItemList)

    this.isOpenedEditDialog = true;
  }

  closeEditDialog(): void {
    this.isOpenedEditDialog = false;
  }

  updateData(): void {
    this.closeConfirmationDialogEdit();
    this.isLoadingSubmit$.set(true);

    const supplier = this.restockForm.controls.supplier.value!;
    const restockDate = this.restockForm.controls.restock_date.value!.toLocalNativeDate();
    const note = this.restockForm.controls.note.value ?? undefined;

    const items: RestockItemsBodyData[] = this.selectedItemsList$().map((d) => {
      return { product_id: d.product_id, quantity: d.quantity,
        purchase_price: deformatToNumber(d.purchase_price),
        discount: deformatToNumber(d.discount)
      }
    })

    const updateSubscription = this.restockService.update(
    this.selectedData$()?.id!,
    {
      supplier_id: supplier.id,
      restock_date: restockDate,
      note: note,
      items: items,
      created_by: this.authetenticatedUser$()!.id
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.restockForm.reset();
          this.refresh();
          this.selectedItemsList$.set([]);
          this.closeEditDialog();

          return this.utilsService.showInfoAlert('UPDATE', response.message);
        } else {
          this.isLoadingSubmit$.set(false);
          return this.utilsService.showErrorAlert('ERROR', response.message);
        }
      }),
      catchError((e) => {
        this.isLoadingSubmit$.set(false);

        return this.utilsService.showErrorHttpMessageAlert(e)
      })
    ).subscribe();

    this.subscription.add(updateSubscription);
  }

  openDeleteDialog(data: RestocksData): void {
    this.isOpenedDeleteDialog = true;

    this.selectedData$.set(data);
  }

  closeDeleteDialog(): void {
    this.isOpenedDeleteDialog = false;
  }

  deleteData(): void {
    this.isLoadingSubmit$.set(true);
    const deleteSubscription = this.restockService.delete(this.selectedData$()?.id!).pipe(
      switchMap((response) => {
        if(response.success) {
          this.refresh()
          this.isLoadingSubmit$.set(false);
          this.closeDeleteDialog()

          return this.utilsService.showInfoAlert("DELETE", response.message);
        } else {
          this.isLoadingSubmit$.set(false);

          return this.utilsService.showErrorAlert("ERROR", response.message);
        }
      }),
      catchError((e) => {
        this.isLoadingSubmit$.set(false);

        return this.utilsService.showErrorHttpMessageAlert(e);
      })
    ).subscribe()

    this.subscription.add(deleteSubscription);
  }

  openDetailDialog(data: RestocksData): void {
    this.selectedData$.set(data);
    this.isOpenedDetailDialog = true;
  }

  closeDetailDialog(): void {
    this.isOpenedDetailDialog = false;
  }

  // Confirmation Logic
  isOpenedConfirmationDialogCreate = false;
  isOpenedConfirmationDialogEdit = false;

  openConfirmationDialogCreate(): void {
    this.isOpenedConfirmationDialogCreate = true;
  }

  closeConfirmationDialogCreate(): void {
    this.isOpenedConfirmationDialogCreate = false
  }

  openConfirmationDialogEdit(): void {
    this.isOpenedConfirmationDialogEdit = true;
  }

  closeConfirmationDialogEdit(): void {
    this.isOpenedConfirmationDialogEdit = false
  }
}
