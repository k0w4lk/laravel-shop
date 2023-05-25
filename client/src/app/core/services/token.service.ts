import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public saveToken(token: string): void {
    sessionStorage.setItem('user-access-token', `Bearer ${token}`);
  }

  public getToken(): string {
    return sessionStorage.getItem('user-access-token');
  }
}
