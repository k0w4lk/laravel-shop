import { UserDtoIn } from './user.interface';

export interface AuthData {
  user: UserDtoIn;
  token: string;
}
