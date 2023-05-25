import { iif, Observable, of, tap } from 'rxjs';
import { UserDtoIn } from '../configs/interfaces/user.interface';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

export const setupUser = (
  tokenService: TokenService,
  userService: UserService
): (() => Observable<UserDtoIn | null>) => {
  const token = tokenService.getToken();

  return () =>
    iif(
      () => !token,
      of(null),
      userService.initUser$(token).pipe(
        tap(user => {
          if (!Array.isArray(user)) {
            userService.setUser({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            });
          }
        })
      )
    );
};
