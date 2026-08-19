import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { InputTextComponent } from '../components/input-text.component/input-text.component';
import { InputPasswordComponent } from "../components/input-password.component/input-password.component";
import {TuiCardLarge } from '@taiga-ui/layout';
import { ControlsOf } from '../../utils/utils';
import { AuthService } from '../services/auth.service';
import { catchError, Subscription, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

interface LoginForm {
  username: string | null
  password: string | null
}

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    TuiLoader,
    TuiButton,
    InputTextComponent,
    InputPasswordComponent,
    TuiCardLarge
],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  formBuilder = inject(FormBuilder);
  loginForm = this.formBuilder.group<ControlsOf<LoginForm>>({
    username: this.formBuilder.control(null, Validators.required),
    password: this.formBuilder.control(null, Validators.required)
  })

  isLoadingSubmit$ = signal(false);

  authService = inject(AuthService)
  router = inject(Router);
  utilsService = inject(UtilsService)
  localStorageService = inject(LocalStorageService);

  subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  login(): void {
    this.isLoadingSubmit$.set(true);
    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    const loginSubscription = this.authService.login(
      username!,
      password!
    ).pipe(
      tap((response) => {
        this.localStorageService.saveDataToStorage("backoffice-jwt", response.token);

        setTimeout(() => {
          this.isLoadingSubmit$.set(false);
          this.router.navigate(['/admin']);
        }, 1000)
      }),
      catchError((e: HttpErrorResponse) => {
        this.isLoadingSubmit$.set(false);
        return this.utilsService.showErrorHttpMessageAlert(e);
      })
    ).subscribe();

    this.subscription.add(loginSubscription);
  }
}
