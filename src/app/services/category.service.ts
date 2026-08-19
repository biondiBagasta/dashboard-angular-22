import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryBody, CategoryData } from '../interfaces/category';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class CategoryService {

  http = inject(HttpClient)

  findMany(): Observable<CategoryData[]> {
    return this.http.get<CategoryData[]>(`${baseUrl}/category/many`)
  }

  create(body: CategoryBody): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/category/create`, body);
  }

  update(id: number, body: CategoryBody): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${baseUrl}/category/update/${id}`, body)
  }

  delete(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${baseUrl}/category/delete/${id}`)
  }
}
