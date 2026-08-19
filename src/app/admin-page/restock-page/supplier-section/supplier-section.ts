import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiCardLarge } from '@taiga-ui/layout';
import { SupplierForm } from './supplier-form/supplier-form';
import { TuiAppearance, TuiButton, TuiDialog, TuiLoader } from '@taiga-ui/core';
import { DeleteDialog } from '../../../components/delete-dialog/delete-dialog';
import { ControlsOf, formValidationErrorProvider } from '../../../../utils/utils';
import { SupplierData } from '../../../interfaces/supplier';
import { UtilsService } from '../../../services/utils.service';
import { SupplierService } from '../../../services/supplier.service';
import { FormBuilder, Validators } from '@angular/forms';
import { catchError, Subscription, switchMap, tap } from 'rxjs';
import { TuiBadge, TuiStatus } from '@taiga-ui/kit';

export interface SupplierFormControls {
  name: string | null;
  address: string | null;
  phone_number: string | null;
  active: boolean | null;
}

@Component({
  selector: 'app-supplier-section',
  imports: [
    TuiTable,
    TuiCardLarge,
    SupplierForm,
    TuiButton,
    TuiLoader,
    DeleteDialog,
    TuiAppearance,
    TuiDialog,
    TuiBadge,
    TuiStatus
  ],
  templateUrl: './supplier-section.html',
  styleUrl: './supplier-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    formValidationErrorProvider
  ]
})
export class SupplierSection {
  supplierList = model.required<SupplierData[]>()

  supplierService = inject(SupplierService)
  utilsService = inject(UtilsService)
  formBuilder = inject(FormBuilder)

  supplierForm = this.formBuilder.group<ControlsOf<SupplierFormControls>>({
    name: this.formBuilder.control(null, Validators.required),
    address: this.formBuilder.control(null, Validators.required),
    phone_number: this.formBuilder.control(null, Validators.required),
    active: this.formBuilder.control(true, Validators.required),
  })

  subscription = new Subscription();

  isLoadingTable$ = signal(true);
  isLoadingSubmit$ = signal(false);

  isOpenedCreateDialog = false
  isOpenedEditDialog = false
  isOpenedDeleteDialog = false

  selectedData$ = signal<SupplierData | null>(null)

  ngOnInit(): void {
    this.supplierForm.controls
    this.initialize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initialize(): void {
    const initializeSubscription = this.supplierService.findMany().pipe(
      tap(data => {
        this.supplierList.set(data)

        this.isLoadingTable$.set(false);
      })
    ).subscribe();

    this.subscription.add(initializeSubscription);
  }

  openCreateDialog(): void {
    this.supplierForm.controls.active.patchValue(true);
    this.isOpenedCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.isOpenedCreateDialog = false;
  }

  createData(): void {
    this.isLoadingSubmit$.set(true);

    const name = this.supplierForm.controls.name.value!;
    const address = this.supplierForm.controls.address.value!;
    const phone_number = this.supplierForm.controls.phone_number.value!;
    const active = (this.supplierForm.controls.active.value!) == true ? 1 : 0;

    const createSubscription = this.supplierService.create({
      name,
      address,
      phone_number,
      active
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.supplierForm.reset();
          this.initialize();
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

  openEditDialog(data: SupplierData): void {
    this.selectedData$.set(data);

    this.supplierForm.patchValue({
      name: data.name,
      address: data.address,
      phone_number: data.phone_number,
      active: data.active == 1 ? true : false,
    });

    this.isOpenedEditDialog = true;
  }

  closeEditDialog(): void {
    this.isOpenedEditDialog = false;
  }

  updateData(): void {
    this.isLoadingSubmit$.set(true);

    const name = this.supplierForm.controls.name.value!;
    const address = this.supplierForm.controls.address.value!;
    const phone_number = this.supplierForm.controls.phone_number.value!;
    const active = (this.supplierForm.controls.active.value!) == true ? 1 : 0;

    const updateSubscription = this.supplierService.update(
    this.selectedData$()?.id!,
    {
      name,
      address,
      phone_number,
      active
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.supplierForm.reset();
          this.initialize();
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

  openDeleteDialog(data: SupplierData): void {
    this.isOpenedDeleteDialog = true;

    this.selectedData$.set(data);
  }

  closeDeleteDialog(): void {
    this.isOpenedDeleteDialog = false;
  }

  deleteData(): void {
    this.isLoadingSubmit$.set(true);
    const deleteSubscription = this.supplierService.delete(this.selectedData$()?.id!).pipe(
      switchMap((response) => {
        if(response.success) {
          this.initialize()
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
}
