import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from '../configs/constants/api';
import {
  UserCreateDtoOut,
  UserDtoIn,
  UsersDtoIn,
} from '../configs/interfaces/user.interface';
import { checkUserRole } from '../utils/check-user-role.util';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public user$: Observable<UserDtoIn>;

  private user = new BehaviorSubject<UserDtoIn>(null);

  constructor(private httpClient: HttpClient) {
    this.user$ = this.user.asObservable();
  }

  public setUser(user: UserDtoIn): void {
    this.user.next(user);
  }

  public checkUserRoles(roles: string[]): boolean {
    return checkUserRole(this.user.getValue()?.role, roles);
  }

  public deleteUser(): void {
    this.user.next(null);
  }

  public getUser$(userId: number): Observable<UserDtoIn> {
    return this.httpClient.get<UserDtoIn>(`${API_URL}/users/${userId}`);
  }

  public editUserRole$(userId: number, slug: string): Observable<void> {
    return this.httpClient.patch<void>(`${API_URL}/users/${userId}`, slug);
  }

  public initUser$(token: string): Observable<UserDtoIn> {
    return this.httpClient.get<UserDtoIn>(`${API_URL}/user`, {
      headers: {
        Authorization: token,
      },
    });
  }

  public getUsers$(queryString: string): Observable<UsersDtoIn> {
    return this.httpClient.get<UsersDtoIn>(`${API_URL}/users${queryString}`);
  }

  public createUser$(body: UserCreateDtoOut): Observable<void> {
    return this.httpClient.post<void>(`${API_URL}/users`, body);
  }
}
