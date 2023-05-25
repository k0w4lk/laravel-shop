import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthData } from '../../../../../configs/interfaces/auth-data.interface';
import { AuthService } from '../../../../../services/auth.service';
import { ButtonComponent } from '../../../../button/button.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['../../styles/form.scss', './sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  @Output() public authData = new EventEmitter<AuthData>();

  public signInForm: FormGroup;
  public passwordHidden = true;

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.initSignInForm();
  }

  public signIn(): void {
    if (this.signInForm.valid) {
      const formData = this.signInForm.getRawValue();

      this.authService.signIn$(formData).subscribe(res => {
        this.authData.emit(res);
      });
    }
  }

  public togglePasswordVisibility(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.passwordHidden = !this.passwordHidden;
  }

  private initSignInForm(): void {
    this.signInForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }
}
