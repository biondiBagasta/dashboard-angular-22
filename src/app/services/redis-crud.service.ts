import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { RedisProduct } from '../interfaces/redis-product';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class RedisCrudService {
  http = inject(HttpClient)

  findMany(): Observable<RedisProduct[]> {
    return this.http.get<RedisProduct[]>(`${baseUrl}/redis-crud/many`)
  }

  create(body: RedisProduct): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/redis-crud/create`, body);
  }

  update(id: number, body: RedisProduct): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${baseUrl}/redis-crud/update/${id}`, body)
  }

  delete(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${baseUrl}/redis-crud/delete/${id}`)
  }
}
