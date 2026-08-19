import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersBody, OrdersPaginate } from '../interfaces/orders';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class OrderService {
  http = inject(HttpClient)

  searchPaginate(page: number, fromDate: Date, toDate: Date): Observable<OrdersPaginate> {
    return this.http.post<OrdersPaginate>(`${baseUrl}/order/search-paginate`, {
      page,
      from_date: fromDate,
      to_date: toDate
    })
  }

  create(body: OrdersBody): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/order/create`, body)
  }
}
