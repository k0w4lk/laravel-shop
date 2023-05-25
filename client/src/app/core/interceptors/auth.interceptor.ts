import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const clonedRequest = req.clone();

  return next(clonedRequest).pipe(
    catchError(err => {
      if (err.status === 401) {
        sessionStorage.removeItem('user-access-token');

        return EMPTY;
      }

      return throwError(() => err);
    })
  );
}
