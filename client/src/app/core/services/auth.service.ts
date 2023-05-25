import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API_URL } from '../configs/constants/api';
import { AuthData } from '../configs/interfaces/auth-data.interface';
import { NotificationService } from './notification.service';
import {
  UserLoginDtoOut,
  UserRegisterDtoOut,
} from '../configs/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpBackend = new HttpClient(this.httpBE);

  constructor(
    private httpBE: HttpBackend,
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {}

  public signIn$(body: UserLoginDtoOut): Observable<AuthData> {
    return this.httpBackend.post<AuthData>(`${API_URL}/auth/login`, body).pipe(
      catchError(err => {
        this.notificationService.show({
          message: err.error.message,
          status: 'danger',
        });
        return throwError(() => err);
      })
    );
  }

  public signUp$(body: UserRegisterDtoOut): Observable<AuthData> {
    return this.httpBackend
      .post<AuthData>(`${API_URL}/auth/register`, body)
      .pipe(
        catchError(err => {
          this.notificationService.show({
            message: err.error.message,
            status: 'danger',
          });
          return throwError(() => err);
        })
      );
  }

  public logout$(): Observable<void> {
    return this.httpClient.post<void>(`${API_URL}/auth/logout`, null);
  }
}
