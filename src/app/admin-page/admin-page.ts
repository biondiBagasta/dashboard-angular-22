import { Component, computed, inject, signal } from '@angular/core';
import { AuthenticatedSignal } from '../signals/authenticated-signal';
import { Router, RouterOutlet } from '@angular/router';
import { catchError, Subscription, tap } from 'rxjs';
import { SidebarMenuItemComponent } from '../components/template/sidebar-menu-item.component/sidebar-menu-item.component';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from '../services/utils.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-admin-page',
  imports: [
    RouterOutlet,
    SidebarMenuItemComponent,
    TuiIcon,
    TuiAvatar,
    TuiButton
  ],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',

})
export class AdminPage {

  isExpandedSidebar = signal(false);
  isToggeledRightMenuDropdown = signal(false);
  authenticatedSignal = inject(AuthenticatedSignal);
  router = inject(Router);
  subscription = new Subscription();
  authService = inject(AuthService);
  authenticatedUser$ = computed(() => this.authenticatedSignal.authenticatedUser$());
  utilsService = inject(UtilsService)
  localStorageService = inject(LocalStorageService);

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initialize(): void {
    const initializeSubscription = this.authService.authenticated().pipe(
      tap(data => {
        this.authenticatedSignal.authenticatedUser$.set(data);
        this.localStorageService.saveDataToStorage("backoffice-jwt", data.password);
      }),
      catchError((e: HttpErrorResponse) => {
        return this.utilsService.showErrorHttpMessageAlert(e);
      })
    ).subscribe();

    this.subscription.add(initializeSubscription);
  }

  logout(): void {
    this.localStorageService.clearStorage();
    this.router.navigate(['/login']);
  }

  toggleRightMenuDropdown(): void {
    this.isToggeledRightMenuDropdown.update((value) => !value)
  }

  toggleSidebar(): void {
    this.isExpandedSidebar.update((value) => !value);
  }
}
