import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiAppearance, TuiButton, TuiDialog, TuiLoader, TuiNotification } from '@taiga-ui/core';
import { OrderService } from '../../services/order.service';
import { FormControl } from '@angular/forms';
import { TuiDayRange } from '@taiga-ui/cdk/date-time';
import { catchError, Subscription, tap } from 'rxjs';
import { TuiAvatar, TuiPagination } from '@taiga-ui/kit';
import { OrdersData, OrdersPaginate } from '../../interfaces/orders';
import { UtilsService } from '../../services/utils.service';
import { PageTitleComponent } from '../../components/template/page-title.component/page-title.component';
import { TuiCardLarge } from "@taiga-ui/layout";
import { DaterangeFilterFieldComponent } from '../../components/daterange-filter-field.component/daterange-filter-field.component';
import { baseUrl } from '../../../utils/utils';

@Component({
  selector: 'app-order-history-page',
  imports: [
    TuiTable,
    TuiButton,
    CurrencyPipe,
    DatePipe,
    TuiDialog,
    TuiAppearance,
    TuiPagination,
    PageTitleComponent,
    TuiCardLarge,
    DaterangeFilterFieldComponent,
    TuiLoader,
    TuiAvatar,
    TuiNotification,
    TuiPagination
  ],
  templateUrl: './order-history-page.html',
  styleUrl: './order-history-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryPage {

  orderService = inject(OrderService)
  utilsService = inject(UtilsService)
  paginationData$ = signal<OrdersPaginate | null>(null)

  searchDateRangeControl = new FormControl<TuiDayRange | null>(null)

  isLoadingTable$ = signal(false)

  subscription = new Subscription()

  isOpenedDetailDialog = false

  selectedData$ = signal<OrdersData | null>(null)

  fileUrl = `${baseUrl}/files/product/image/`

  ngOnInit(): void {
    this.search(0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(index: number): void {
    this.isLoadingTable$.set(true);
    const page = index + 1;

    const fromDate = this.searchDateRangeControl.value?.from.toLocalNativeDate() ?? new Date();
    const toDate = this.searchDateRangeControl.value?.to.toLocalNativeDate() ?? new Date()

    const searchSubscription = this.orderService.searchPaginate(page,
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

  openDetailDialog(data: OrdersData): void {
    this.selectedData$.set(data);

    this.isOpenedDetailDialog = true;
  }

  closeDetailDialog(): void {
    this.isOpenedDetailDialog = false;
  }
}
