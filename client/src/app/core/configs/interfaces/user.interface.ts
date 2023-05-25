import { Pagination } from './pagination.interface';
import { Role } from './role.interface';

export interface UsersDtoIn {
  data: UserDtoIn | UserDtoIn[];
  pagination: Pagination;
}

export interface UserDtoIn {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface UserLoginDtoOut {
  email: string;
  password: string;
}

export interface UserRegisterDtoOut {
  email: string;
  password: string;
  name: string;
}

export interface UserCreateDtoOut extends UserRegisterDtoOut {
  role_id: number;
}
