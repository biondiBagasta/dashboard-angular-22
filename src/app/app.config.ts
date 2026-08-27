import { provideTaiga } from '@taiga-ui/core';
import { ApplicationConfig, inject, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import localeId from '@angular/common/locales/id';
import { registerLocaleData } from "@angular/common";
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { LocalStorageService } from './services/local-storage.service';
import { provideHighcharts } from 'highcharts-angular';
import { SocketIoConfig, provideSocketIo } from 'ngx-socket-io'

registerLocaleData(localeId, 'id');

const baseUrlSocket = "http://localhost:8081"

const socketConfig: SocketIoConfig = { url: baseUrlSocket, options: {} };

const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const cookieExist = localStorageService.getDataFromStorage("backoffice-jwt");

  if(cookieExist) {
    req = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + cookieExist)
    })

  }

  return next(req);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTaiga(),
    provideHttpClient(
      withInterceptors(
        [
          jwtInterceptor
        ]
      )
    ),
    { provide: LOCALE_ID, useValue: "id-ID" },
    provideHighcharts({
      instance: () => import('highcharts/esm/highcharts').then(m => m.default),
    }),
    provideSocketIo(socketConfig)
  ],
};
