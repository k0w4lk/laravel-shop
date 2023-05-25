import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoriesService } from '../../../../../../core/services/categories.service';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCategoryComponent {
  @Output() public categoryCreated = new EventEmitter<void>();

  public categoryForm: FormGroup;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.initCategoryForm();
  }

  public createCategory(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.getRawValue();

      this.categoriesService.createCategory$(formData).subscribe(() => {
        this.categoryCreated.emit();
        this.categoryForm.reset();
      });
    }
  }

  private initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }
}
