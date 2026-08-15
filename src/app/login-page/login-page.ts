import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { InputTextComponent } from '../components/input-text.component/input-text.component';
import { InputPasswordComponent } from "../components/input-password.component/input-password.component";
	import {TuiCardLarge } from '@taiga-ui/layout';

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
  loginForm = this.formBuilder.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  })

  isLoadingSubmit$ = signal(false);

  login(): void {

  }
}
