import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../configs/constants/api';
import {
  CategoryDtoIn,
  CategoryDtoOut,
} from '../configs/interfaces/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private httpClient: HttpClient) {}

  public getCategories$(queryString: string = ''): Observable<CategoryDtoIn> {
    return this.httpClient.get<CategoryDtoIn>(
      `${API_URL}/categories${queryString}`
    );
  }

  public createCategory$(body: CategoryDtoOut): Observable<void> {
    return this.httpClient.post<void>(`${API_URL}/categories`, body);
  }

  public deleteCategory$(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${API_URL}/categories/${id}`);
  }
}
