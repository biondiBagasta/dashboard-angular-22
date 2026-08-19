import { ChangeDetectionStrategy, Component, inject, input, model, signal, WritableSignal } from '@angular/core';
import { CategoryData } from '../../../interfaces/category';
import { UtilsService } from '../../../services/utils.service';
import { CategoryService } from '../../../services/category.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ControlsOf } from '../../../../utils/utils';
import { catchError, Subscription, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryForm } from './category-form/category-form';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAppearance, TuiButton, TuiDialog, TuiLoader } from '@taiga-ui/core';
import { DeleteDialog } from '../../../components/delete-dialog/delete-dialog';

export interface CategoryFormControls {
  name: string | null
}

@Component({
  selector: 'app-category-section',
  imports: [
    TuiTable,
    TuiCardLarge,
    CategoryForm,
    TuiButton,
    TuiLoader,
    DeleteDialog,
    TuiAppearance,
    TuiDialog
],
  templateUrl: './category-section.html',
  styleUrl: './category-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategorySection {

  categoryList = model.required<CategoryData[]>()

  categoryService = inject(CategoryService)
  utilsService = inject(UtilsService)
  formBuilder = inject(FormBuilder)

  categoryForm = this.formBuilder.group<ControlsOf<CategoryFormControls>>({
    name: this.formBuilder.control(null, Validators.required)
  })

  subscription = new Subscription();

  isLoadingTable$ = signal(true);
  isLoadingSubmit$ = signal(false);

  isOpenedCreateDialog = false
  isOpenedEditDialog = false
  isOpenedDeleteDialog = false

  selectedData$ = signal<CategoryData | null>(null)

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initialize(): void {
    const initializeSubscription = this.categoryService.findMany().pipe(
      tap(data => {
        this.categoryList.set(data)

        this.isLoadingTable$.set(false);
      })
    ).subscribe();

    this.subscription.add(initializeSubscription);
  }

  openCreateDialog(): void {
    this.isOpenedCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.isOpenedCreateDialog = false;
  }

  createData(): void {
    this.isLoadingSubmit$.set(true);

    const name = this.categoryForm.controls.name.value!;

    const createSubscription = this.categoryService.create({
      name
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.categoryForm.reset();
          this.initialize();
          this.closeCreateDialog();

          return this.utilsService.showInfoAlert('CREATE', response.message);
        } else {
          this.isLoadingSubmit$.set(false);
          return this.utilsService.showErrorAlert('ERROR', response.message);
        }
      }),
      catchError((e: HttpErrorResponse) => {
        this.isLoadingSubmit$.set(false);

        return this.utilsService.showErrorHttpMessageAlert(e)
      })
    ).subscribe();

    this.subscription.add(createSubscription);
  }

  openEditDialog(data: CategoryData): void {
    this.selectedData$.set(data);

    this.categoryForm.patchValue({
      name: data.name
    });

    this.isOpenedEditDialog = true;
  }

  closeEditDialog(): void {
    this.isOpenedEditDialog = false;
  }

  updateData(): void {
    this.isLoadingSubmit$.set(true);

    const name = this.categoryForm.controls.name.value!;

    const updateSubscription = this.categoryService.update(
    this.selectedData$()?.id!,
    {
      name
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.categoryForm.reset();
          this.initialize();
          this.closeEditDialog();

          return this.utilsService.showInfoAlert('UPDATE', response.message);
        } else {
          this.isLoadingSubmit$.set(false);
          return this.utilsService.showErrorAlert('ERROR', response.message);
        }
      }),
      catchError((e: HttpErrorResponse) => {
        this.isLoadingSubmit$.set(false);

        return this.utilsService.showErrorHttpMessageAlert(e)
      })
    ).subscribe();

    this.subscription.add(updateSubscription);
  }

  openDeleteDialog(data: CategoryData): void {
    this.isOpenedDeleteDialog = true;

    this.selectedData$.set(data);
  }

  closeDeleteDialog(): void {
    this.isOpenedDeleteDialog = false;
  }

  deleteData(): void {
    this.isLoadingSubmit$.set(true);
    const deleteSubscription = this.categoryService.delete(this.selectedData$()?.id!).pipe(
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
      catchError((e: HttpErrorResponse) => {
        this.isLoadingSubmit$.set(false);

        return this.utilsService.showErrorHttpMessageAlert(e);
      })
    ).subscribe()

    this.subscription.add(deleteSubscription);
  }
}
