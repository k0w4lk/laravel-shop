import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export function ErrorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const clonedRequest = req.clone();
  const notificationService = inject(NotificationService);

  return next(clonedRequest).pipe(
    catchError(err => {
      notificationService.show({
        message: err.error.message || err.message,
        status: 'danger',
      });

      return throwError(() => err);
    })
  );
}
