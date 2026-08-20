import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'sidebar-menu-item-component',
  imports: [
    TuiIcon,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar-menu-item.component.html',
  styleUrl: './sidebar-menu-item.component.css',
})
export class SidebarMenuItemComponent {
  icon = input.required<string>()

  name = input.required<string>()

  routerLink = input.required<string>()
}
