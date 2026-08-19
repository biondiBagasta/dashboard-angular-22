import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { RestockBody, RestockPaginate } from '../interfaces/restocks';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class RestockService {

  http = inject(HttpClient)

  searchPaginate(page: number, fromDate: Date, toDate: Date): Observable<RestockPaginate> {
    return this.http.post<RestockPaginate>(`${baseUrl}/restock/search-paginate`, {
      from_date: fromDate,
      to_date: toDate,
      page
    })
  }

  searchPaginateLimitFive(page: number, term: string): Observable<RestockPaginate> {
    return this.http.post<RestockPaginate>(`${baseUrl}/restock/search-paginate-limit-five`, {
      term,
      page
    })
  }

  create(body: RestockBody): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/restock/create`, body)
  }


  update(id: number, body: RestockBody): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${baseUrl}/restock/update/${id}`, body)
  }

  delete(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${baseUrl}/restock/delete/${id}`)
  }
}
