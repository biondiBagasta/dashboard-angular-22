import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBody, UserData } from '../interfaces/user';
import { baseUrl } from '../../utils/utils';
import { ResponseMessage } from '../interfaces/response-message';

@Service()
export class UserService {
  http = inject(HttpClient)

  findMany(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${baseUrl}/user/many`)
  }

  create(body: UserBody): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${baseUrl}/user/create`, body);
  }

  update(id: number, body: UserBody): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${baseUrl}/user/update/${id}`, body)
  }

  delete(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(`${baseUrl}/user/delete/${id}`)
  }

}
