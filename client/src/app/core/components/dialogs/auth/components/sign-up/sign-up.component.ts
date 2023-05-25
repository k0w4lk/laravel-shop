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
  selector: 'app-sign-up',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../styles/form.scss', './sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  @Output() public authData = new EventEmitter<AuthData>();

  public signUpForm: FormGroup;
  public passwordHidden = true;

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.initSignUpForm();
  }

  public signUp(): void {
    if (this.signUpForm.valid) {
      const formData = this.signUpForm.getRawValue();

      this.authService.signUp$(formData).subscribe(res => {
        this.authData.emit(res);
      });
    }
  }

  public togglePasswordVisibility(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.passwordHidden = !this.passwordHidden;
  }

  private initSignUpForm(): void {
    this.signUpForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }
}
