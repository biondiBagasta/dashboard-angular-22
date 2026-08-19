import { inject, Service } from '@angular/core';
import { TuiNotificationService } from '@taiga-ui/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Service()
export class UtilsService {

  notificationService = inject(TuiNotificationService)

  showErrorHttpMessageAlert(e: HttpErrorResponse): Observable<void> {
    return this.notificationService.open(
    `${e.message} - [${e.error.message}]`,
    {
      icon: "@tui.circle-alert",
      appearance: "negative",
      autoClose: 5000,
      label: "ERROR"
    })
  }

  showInfoAlert(title: string, message: string): Observable<void> {
    return this.notificationService.open(message, {
      icon: "@tui.info",
      appearance: "info",
      autoClose: 5000,
      label: title
    })
  }

  showErrorAlert(title: string, message: string): Observable<void> {
    return this.notificationService.open(message, {
      icon: "@tui.circle-alert",
      appearance: "negative",
      autoClose: 5000,
      label: title
    })
  }
}
