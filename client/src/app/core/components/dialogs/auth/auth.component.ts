import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthData } from '../../../configs/interfaces/auth-data.interface';
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';
import { ButtonComponent } from '../../button/button.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    SignInComponent,
    SignUpComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  public selectedAction = 'sign-in';

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialogRef: DialogRef,
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  public selectAction(action: string): void {
    this.selectedAction = action;
    this.cdRef.markForCheck();
  }

  public saveAuthData(data: AuthData) {
    this.userService.setUser(data.user);
    this.tokenService.saveToken(data.token);
    this.dialogRef.close();
  }
}
