import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { MANAGE_ROLES } from '../configs/constants/manage-roles';
import { UserService } from '../services/user.service';
import { checkUserRole } from '../utils/check-user-role.util';

export const managersGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(UserService).user$.pipe(
    map(user => {
      const accessGranted = checkUserRole(user?.role, MANAGE_ROLES);

      return accessGranted;
    })
  );
};
