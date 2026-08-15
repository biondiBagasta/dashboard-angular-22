import { Component, computed, inject, signal } from '@angular/core';
import { AuthenticatedSignal } from '../signals/authenticated-signal';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarMenuItemComponent } from '../components/template/sidebar-menu-item.component/sidebar-menu-item.component';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';

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
  authenticatedUser$ = computed(() => this.authenticatedSignal.authenticatedUser$());

  ngOnInit(): void {

    this.initialize();
  }

  initialize(): void {

  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleRightMenuDropdown(): void {
    this.isToggeledRightMenuDropdown.update((value) => !value)
  }

  toggleSidebar(): void {
    this.isExpandedSidebar.update((value) => !value);
  }
}
