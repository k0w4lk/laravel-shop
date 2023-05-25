import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../configs/constants/api';
import {
  EditProductDtoOut,
  Product,
  ProductsDtoIn,
} from '../configs/interfaces/products.interface';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  public getProducts$(queryString: string): Observable<ProductsDtoIn> {
    return this.httpClient.get<ProductsDtoIn>(
      `${API_URL}/products${queryString}`
    );
  }

  public getProduct$(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${API_URL}/products/${id}`);
  }

  public getProductReviews$(id: number, queryString: string): Observable<any> {
    return this.httpClient.get<any>(
      `${API_URL}/products/${id}/reviews${queryString}`
    );
  }

  public createProduct$(body: any): Observable<void> {
    return this.httpClient.post<void>(`${API_URL}/products`, body);
  }

  public editProduct$(id: number, body: EditProductDtoOut): Observable<void> {
    return this.httpClient.patch<void>(`${API_URL}/products/${id}`, body);
  }

  public deleteProduct$(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${API_URL}/products/${id}`);
  }
}
