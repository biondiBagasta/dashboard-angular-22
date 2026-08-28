import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiCardLarge } from '@taiga-ui/layout';
import { RedisProductData } from '../../interfaces/redis-product';
import { RedisCrudService } from '../../services/redis-crud.service';
import { UtilsService } from '../../services/utils.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ControlsOf } from '../../../utils/utils';
import { catchError, Subscription, switchMap, tap } from 'rxjs';
import { RedisCrudForm } from './redis-crud-form/redis-crud-form';
import { TuiAppearance, TuiButton, TuiDialog, TuiLoader, TuiNotification } from '@taiga-ui/core';
import { DeleteDialog } from '../../components/delete-dialog/delete-dialog';
import { nanoid } from 'nanoid'
import { PageTitleComponent } from "../../components/template/page-title.component/page-title.component";
import { InputSearchComponent } from '../../components/input-search.component/input-search.component';

export interface RedisProductFormControls {
  name: string | null,
  price: string | null
}

@Component({
  selector: 'app-redis-crud-page',
  imports: [
    TuiTable,
    TuiCardLarge,
    RedisCrudForm,
    TuiButton,
    TuiLoader,
    DeleteDialog,
    TuiAppearance,
    TuiDialog,
    PageTitleComponent,
    TuiNotification,
    InputSearchComponent
],
  templateUrl: './redis-crud-page.html',
  styleUrl: './redis-crud-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedisCrudPage {
  dataList$ = signal<RedisProductData[]>([])

  redisCrudService = inject(RedisCrudService)
  utilsService = inject(UtilsService)
  formBuilder = inject(FormBuilder)

  redisCrudForm = this.formBuilder.group<ControlsOf<RedisProductFormControls>>({
    name: this.formBuilder.control(null, Validators.required),
    price: this.formBuilder.control(null, Validators.required)
  })

  subscription = new Subscription();

  isLoadingTable$ = signal(true);
  isLoadingSubmit$ = signal(false);

  isOpenedCreateDialog = false
  isOpenedEditDialog = false
  isOpenedDeleteDialog = false

  selectedData$ = signal<RedisProductData | null>(null)

  searchControl = new FormControl<string | null>(null)

  ngOnInit(): void {
    this.searchMany();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchMany(): void {
    const term = this.searchControl.value ?? "";

    const initializeSubscription = this.redisCrudService.searchMany(term).pipe(
      tap(data => {
        this.dataList$.set(data)

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

    const name = this.redisCrudForm.controls.name.value!;
    const price = this.redisCrudForm.controls.price.value!;
    const id = nanoid();

    const createSubscription = this.redisCrudService.create({
      name,
      price,
      id
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.redisCrudForm.reset();
          this.searchMany();
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

  openEditDialog(data: RedisProductData): void {
    this.selectedData$.set(data);

    this.redisCrudForm.patchValue({
      name: data.name,
      price: data.price
    });

    this.isOpenedEditDialog = true;
  }

  closeEditDialog(): void {
    this.isOpenedEditDialog = false;
  }

  updateData(): void {
    this.isLoadingSubmit$.set(true);

    const name = this.redisCrudForm.controls.name.value!;
    const price = this.redisCrudForm.controls.price.value!;
    const id = nanoid();

    const updateSubscription = this.redisCrudService.update(
    this.selectedData$()?.id!,
    {
      name,
      price,
      id
    }).pipe(
      switchMap(response => {
        if(response.success) {
          this.isLoadingSubmit$.set(false);
          this.redisCrudForm.reset();
          this.searchMany();
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

  openDeleteDialog(data: RedisProductData): void {
    this.isOpenedDeleteDialog = true;

    this.selectedData$.set(data);
  }

  closeDeleteDialog(): void {
    this.isOpenedDeleteDialog = false;
  }

  deleteData(): void {
    this.isLoadingSubmit$.set(true);
    const deleteSubscription = this.redisCrudService.delete(this.selectedData$()?.id!).pipe(
      switchMap((response) => {
        if(response.success) {
          this.searchMany()
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
