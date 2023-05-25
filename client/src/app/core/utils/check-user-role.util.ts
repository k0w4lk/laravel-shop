import { Role } from '../configs/interfaces/role.interface';

export const checkUserRole = (userRole: Role, targetRoles: string[]) =>
  targetRoles.includes(userRole?.slug);
