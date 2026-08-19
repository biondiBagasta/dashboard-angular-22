import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBody, ProductPaginate } from '../interfaces/product';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class ProductService {
  http = inject(HttpClient)

  searchPaginate(page: number, term: string): Observable<ProductPaginate> {
    return this.http.post<ProductPaginate>(`${baseUrl}/product/search-paginate`, {
      term,
      page
    })
  }

  searchPaginateLimitFive(page: number, term: string): Observable<ProductPaginate> {
    return this.http.post<ProductPaginate>(`${baseUrl}/product/search-paginate-limit-five`, {
      term,
      page
    })
  }

  create(body: ProductBody): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/product/create`, body)
  }


  update(id: number, body: ProductBody): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${baseUrl}/product/update/${id}`, body)
  }

  delete(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${baseUrl}/product/delete/${id}`)
  }
}
