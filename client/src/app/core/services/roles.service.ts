import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../configs/constants/api';
import { Role } from '../configs/interfaces/role.interface';

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private httpClient: HttpClient) {}

  public getRoles$(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${API_URL}/roles`);
  }
}
