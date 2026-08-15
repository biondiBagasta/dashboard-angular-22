import { Service, signal } from '@angular/core';
import { UserData } from '../interfaces/user';

@Service()
export class AuthenticatedSignal {

  authenticatedUser$ = signal<UserData | null>(null);
}
