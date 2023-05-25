import { Pagination } from './pagination.interface';

export interface Category {
  id: number;
  name: string;
}

export interface CategoryDtoIn extends Category {
  data: Category[];
  pagination: Pagination;
}

export interface CategoryDtoOut {
  name: string;
}
