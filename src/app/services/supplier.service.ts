import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplierBody, SupplierData } from '../interfaces/supplier';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class SupplierService {
  http = inject(HttpClient)

  findMany(): Observable<SupplierData[]> {
    return this.http.get<SupplierData[]>(`${baseUrl}/supplier/many`)
  }

  create(body: SupplierBody): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/supplier/create`, body);
  }

  update(id: number, body: SupplierBody): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${baseUrl}/supplier/update/${id}`, body)
  }

  delete(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${baseUrl}/supplier/delete/${id}`)
  }
}
