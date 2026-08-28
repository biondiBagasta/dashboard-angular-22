import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { RedisProductData } from '../interfaces/redis-product';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class RedisCrudService {
  http = inject(HttpClient)

  searchMany(term: string): Observable<RedisProductData[]> {
    return this.http.post<RedisProductData[]>(`${baseUrl}/redis-crud/many`, {term})
  }

  create(body: RedisProductData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/redis-crud/create`, body);
  }

  update(id: string, body: RedisProductData): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${baseUrl}/redis-crud/update/${id}`, body)
  }

  delete(id: string): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${baseUrl}/redis-crud/delete/${id}`)
  }
}
