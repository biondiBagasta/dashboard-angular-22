import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CategoryData } from '../../interfaces/category';
import { TuiCardLarge } from '@taiga-ui/layout';
import { PageTitleComponent } from "../../components/template/page-title.component/page-title.component";
import { CategorySection } from './category-section/category-section';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { UtilsService } from '../../services/utils.service';
import { ProductData, ProductPaginate } from '../../interfaces/product';
import { baseUrl, ControlsOf, deformatToNumber, formatCurrencyMaskito, formatPercentMaskito } from '../../../utils/utils';
import { catchError, of, retry, Subscription, switchMap, tap } from 'rxjs';
import { FilesService } from '../../services/files.service';
import { FileResponse } from '../../interfaces/file-response';
import { TuiAppearance, TuiButton, TuiDialog, TuiLoader, TuiNotification } from '@taiga-ui/core';
import { CurrencyPipe } from '@angular/common';
import { TuiAvatar, TuiPagination } from '@taiga-ui/kit';
import { TuiTable } from '@taiga-ui/addon-table';
import { InputSearchComponent } from '../../components/input-search.component/input-search.component';
import { DeleteDialog } from '../../components/delete-dialog/delete-dialog';
import { ProductForm } from './product-form/product-form';
import { SelectItem } from '../../interfaces/select-item';
import { DetailImageDialog } from '../../components/detail-image-dialog/detail-image-dialog';

export interface ProductFormControls {
  code: string | null;
  name: string | null;
  description: string | null;
  purchase_price: string | null;
  selling_price: string | null;
  stock: number | null;
  discount: string | null;
  category: SelectItem | null
  image: File | null
}
@Component({
  selector: 'app-product-page',
  imports: [
    TuiCardLarge,
    PageTitleComponent,
    CategorySection,
    ReactiveFormsModule,
    TuiLoader,
    CurrencyPipe,
    TuiAvatar,
    TuiNotification,
    TuiPagination,
    TuiButton,
    TuiTable,
    InputSearchComponent,
    TuiAppearance,
    DeleteDialog,
    TuiDialog,
    ProductForm,
    DetailImageDialog
],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPage {

  formBuilder = inject(FormBuilder)
  productService = inject(ProductService)
  utilsService = inject(UtilsService)
  filesService = inject(FilesService)

  isLoadingTable$ = signal(false);
  isLoadingSubmit$ = signal(false);

  paginationData$ = signal<ProductPaginate | null>(null)

  selectedData$ = signal<ProductData | null>(null)

  categoryList$ = signal<CategoryData[]>([])

  categorySelectList$ = computed<SelectItem[]>(() =>
    this.categoryList$().map(category => ({
      id: category.id,
      name: category.name,
    }))
  );

  isOpenedCreateDialog = false;
  isOpenedEditDialog = false;
  isOpenedDeleteDialog = false;
  isOpenedDetailImageDialog = false;

  selectedDetailImage$ = signal("");

  searchControl = new FormControl()

  productForm = this.formBuilder.group<ControlsOf<ProductFormControls>>({
    code: this.formBuilder.control(null, Validators.required),
    name: this.formBuilder.control(null, Validators.required),
    description: this.formBuilder.control(null, Validators.required),
    purchase_price: this.formBuilder.control(null, Validators.required),
    selling_price: this.formBuilder.control(null, Validators.required),
    stock: this.formBuilder.control(null, Validators.required),
    discount: this.formBuilder.control(null, Validators.required),
    category: this.formBuilder.control(null, Validators.required),
    image: this.formBuilder.control(null, null)
  });

  subscription = new Subscription();

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

    const term = this.searchControl.value ?? ""

    const searchSubscription = this.productService.searchPaginate(page,
      term
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
    this.searchControl.reset();
    this.search(0);
  }

  openCreateDialog(): void {
    this.isOpenedCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.productForm.reset();
    this.isOpenedCreateDialog = false;
  }

  createData(): void {
    this.isLoadingSubmit$.set(true);

    const code = this.productForm.controls.code.value!;
    const name = this.productForm.controls.name.value!;
    const description = this.productForm.controls.description.value!;
    const purchase_price = deformatToNumber(this.productForm.controls.purchase_price.value!)
    const selling_price = deformatToNumber(this.productForm.controls.selling_price.value!)
    const stock = this.productForm.controls.stock.value!
    const discount = deformatToNumber(this.productForm.controls.discount.value!);
    const category = this.productForm.controls.category.value!;

    const image = this.productForm.controls.image.value!;

    const formData = new FormData();
    formData.append("product_image", image);

    const createSubscription = this.filesService.uploadProductImage(formData).pipe(
      retry(3),
      switchMap(fileResponse => {
        return this.productService.create({
          code,
          name,
          description,
          purchase_price,
          selling_price,
          stock,
          discount,
          category_id: category.id,
          image: fileResponse.file_name
        }).pipe(
          switchMap(data => {
            this.isLoadingSubmit$.set(false);

            if(data.success) {
              this.closeCreateDialog();
              this.refresh();

              return this.utilsService.showInfoAlert("CREATE", data.message)
            } else {
              return this.utilsService.showErrorAlert("ERROR", data.message);
            }
          }),
          catchError((e) => {
            this.isLoadingSubmit$.set(false);
            return this.utilsService.showErrorHttpMessageAlert(e);
          }),
        )
      }),
      catchError((e) => {
        this.isLoadingSubmit$.set(false);
        return this.utilsService.showErrorHttpMessageAlert(e);
      })
    ).subscribe();

    this.subscription.add(createSubscription);
  }

  openEditDialog(data: ProductData): void {
    this.selectedData$.set(data);

    const categoryData: SelectItem = {
      id: data.category_id,
      name: data.edges.category.name
    }

    this.productForm.patchValue({
      code: data.code,
      name: data.name,
      description: data.description,
      purchase_price: formatCurrencyMaskito(data.purchase_price),
      selling_price: formatCurrencyMaskito(data.selling_price),
      stock: data.stock,
      discount: formatPercentMaskito(data.discount ?? 0),
      category: categoryData
    })
    this.isOpenedEditDialog = true;
  }

  closeEditDialog(): void {
    this.productForm.reset();
    this.isOpenedEditDialog = false;
  }

  updateData(): void {
    this.isLoadingSubmit$.set(true);

    const code = this.productForm.controls.code.value!;
    const name = this.productForm.controls.name.value!;
    const description = this.productForm.controls.description.value!;
    const purchase_price = deformatToNumber(this.productForm.controls.purchase_price.value!)
    const selling_price = deformatToNumber(this.productForm.controls.selling_price.value!)
    const stock = this.productForm.controls.stock.value!
    const discount = deformatToNumber(this.productForm.controls.discount.value!);
    const category = this.productForm.controls.category.value!;

    const image = this.productForm.controls.image.value!;

    const formData = new FormData();
    formData.append("product_image", image);

    const uploadImage$ = image != null ? this.filesService.deleteProductImage(
      this.selectedData$()!.image
    ).pipe(
      switchMap((_) => this.filesService.uploadProductImage(formData))
    ) : of<FileResponse>({
      file_name: this.selectedData$()!.image,
      file_extension: ""
    });

    const editSubscription = uploadImage$.pipe(
      retry(5),
      switchMap((fileResponse) => {
        return this.productService.update(this.selectedData$()!.id, {
          code,
          name,
          description,
          purchase_price,
          selling_price,
          stock,
          discount,
          category_id: category.id,
          image: fileResponse.file_name
        }).pipe(
          switchMap(data => {
            this.isLoadingSubmit$.set(false);

            if(data.success) {
              this.closeEditDialog()
              this.refresh();

              return this.utilsService.showInfoAlert("UPDATE", data.message)
            } else {
              return this.utilsService.showErrorAlert("ERROR", data.message);
            }
          }),
          catchError((e) => {
            this.isLoadingSubmit$.set(false);
            return this.utilsService.showErrorHttpMessageAlert(e);
          }),
        )
      }),
      catchError((e) => {
        this.isLoadingSubmit$.set(false);
        return this.utilsService.showErrorHttpMessageAlert(e);
      }),
    ).subscribe();

    this.subscription.add(editSubscription)
  }

  openDeleteDialog(data: ProductData): void {
    this.selectedData$.set(data);
    this.isOpenedDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.isOpenedDeleteDialog = false;
  }

  deleteData(): void {
    this.isLoadingSubmit$.set(true);
    const deleteSubscription = this.productService.delete(this.selectedData$()!.id).pipe(
      switchMap(data => {
        if(data.success) {
          return this.filesService.deleteProductImage(this.selectedData$()!.image).pipe(
            switchMap(() => {
              this.isLoadingSubmit$.set(false);
              this.closeDeleteDialog();
              this.refresh()
              return this.utilsService.showInfoAlert("DELETE", data.message);
            }),
            catchError((e) => {
              this.isLoadingSubmit$.set(false);
              return this.utilsService.showErrorHttpMessageAlert(e);
            })
          )
        } else {
          this.isLoadingSubmit$.set(false);
          return this.utilsService.showErrorAlert("ERROR", data.message);
        }
      }),
      catchError((e) => {
        this.isLoadingSubmit$.set(false);
        return this.utilsService.showErrorHttpMessageAlert(e);
      })
    ).subscribe();

    this.subscription.add(deleteSubscription);
  }

  openDetailImageDialog(fileName: string): void {
    this.selectedDetailImage$.set(fileName);
    this.isOpenedDetailImageDialog = true;
  }

}
