import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

export function TokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authTokenService = inject(TokenService);
  const authToken = authTokenService.getToken();

  const headers: { [name: string]: string | string[] } = {
    Accept: 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = authToken;
  }

  const clonedRequest = req.clone({
    setHeaders: headers,
    withCredentials: true,
  });

  return next(clonedRequest);
}
