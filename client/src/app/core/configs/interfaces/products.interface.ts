import { Pagination } from './pagination.interface';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  categoryName?: string;
  category_id?: string;
  userId: number;
  image_path: string;
  rating_amount: number;
  rating: string;
}

export interface ProductsDtoIn {
  data: Product[];
  pagination: Pagination;
}

export interface EditProductDtoOut {
  name: string;
  price: number;
}
