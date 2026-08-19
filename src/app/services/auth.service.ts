import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';
import { baseUrl } from '../../utils/utils';
import { UserData } from '../interfaces/user';

@Service()
export class AuthService {

  http = inject(HttpClient)

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${baseUrl}/auth/login`, {
      username,
      password
    })
  }

  authenticated(): Observable<UserData> {
    return this.http.post<UserData>(`${baseUrl}/auth/authenticated`, {})
  }
}
