import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./login-page/login-page").then((m) => m.LoginPage)
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
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  }
];
