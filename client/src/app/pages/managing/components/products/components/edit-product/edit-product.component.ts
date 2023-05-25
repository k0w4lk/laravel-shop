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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../../../../../core/services/products.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductComponent implements OnInit {
  public editProductForm: FormGroup;
  public productImage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<EditProductComponent>,
    private productsService: ProductsService
  ) {}

  public ngOnInit(): void {
    this.initEditProductForm();
  }

  public editProduct(): void {
    if (this.editProductForm.valid) {
      const formData = this.editProductForm.getRawValue();

      this.productsService
        .editProduct$(this.data.id, formData)
        .subscribe(() => {
          this.matDialogRef.close(true);
        });
    }
  }

  public close(): void {
    this.matDialogRef.close(false);
  }

  private initEditProductForm(): void {
    this.editProductForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
    });

    this.productsService.getProduct$(this.data.id).subscribe(product => {
      this.productImage = product.image_path;
      this.editProductForm.patchValue(product);
      this.cdRef.markForCheck();
    });
  }
}
