import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';

const adminPageGuard = () => {
    const localStorageService = inject(LocalStorageService);
    const jwt = localStorageService.getDataFromStorage('backoffice-jwt');
    const router = inject(Router);

    if(!jwt) {
      router.navigate(['/login']);
    }

    return true;
}

const loginPageGuard = () => {
	const localStorageService = inject(LocalStorageService);
	const jwt = localStorageService.getDataFromStorage('backoffice-jwt');
	const router = inject(Router);

	if(jwt) {
	  router.navigate(['/admin']);
	}

	return true;
}

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./login-page/login-page").then((m) => m.LoginPage),
    canMatch: [loginPageGuard]
  },
  {
    path: "admin",
    loadComponent: () => import("./admin-page/admin-page").then((m) => m.AdminPage),
    children: [
      {
        path: "dashboard",
        loadComponent: () => import("./admin-page/dashboard-page/dashboard-page").then((m) => m.DashboardPage),
      },
      {
        path: "product",
        loadComponent: () => import("./admin-page/product-page/product-page").then((m) => m.ProductPage)
      },
      {
        path: "restock",
        loadComponent: () => import("./admin-page/restock-page/restock-page").then((m) => m.RestockPage)
      },
      {
        path: "order-history",
        loadComponent: () => import("./admin-page/order-history-page/order-history-page").then((m) => m.OrderHistoryPage)
      },
      {
        path: "order-create",
        loadComponent: () => import("./admin-page/order-create-page/order-create-page").then((m) => m.OrderCreatePage)
      },
      {
        path: "redis-crud",
        loadComponent: () => import("./admin-page/redis-crud-page/redis-crud-page").then((m) => m.RedisCrudPage)
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      }
    ],
    canMatch: [adminPageGuard]
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  }
];
