import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../../../core/services/user.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRoleComponent implements OnInit {
  public editRoleForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<EditRoleComponent>,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.initEditProductForm();
  }

  public editRole(): void {
    if (this.editRoleForm.valid) {
      const formData = this.editRoleForm.getRawValue();

      this.userService
        .editUserRole$(this.data.userId, formData)
        .subscribe(() => {
          this.matDialogRef.close(true);
        });
    }
  }

  public close(): void {
    this.matDialogRef.close(false);
  }

  private initEditProductForm(): void {
    this.editRoleForm = this.fb.group({
      slug: [null, [Validators.required]],
    });

    this.userService.getUser$(this.data.userId).subscribe(user => {
      this.editRoleForm.patchValue({ slug: user.role.slug });
      this.cdRef.markForCheck();
    });
  }
}
