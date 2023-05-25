import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Category } from '../../../../../../core/configs/interfaces/category.interface';
import { CategoriesService } from '../../../../../../core/services/categories.service';
import { ProductsService } from '../../../../../../core/services/products.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductComponent implements OnInit {
  @ViewChild('productImage')
  private productImageRef: ElementRef<HTMLInputElement>;

  @Output() public productCreated = new EventEmitter<void>();

  public productForm: FormGroup;

  public categories: Category[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private productsService: ProductsService
  ) {}

  public ngOnInit(): void {
    this.initProductForm();
    this.initCategories();
  }

  public createProduct(): void {
    if (this.productForm.valid) {
      const formData = this.productForm.getRawValue();
      const productImage = this.productImageRef.nativeElement.files[0] || null;

      const body = new FormData();

      body.append('category_id', formData.category_id);
      body.append('name', formData.name);
      body.append('description', formData.description);
      body.append('price', formData.price);
      body.append('image', productImage);

      this.productsService
        .createProduct$(body)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.productCreated.emit();
          this.productForm.reset();
          this.productImageRef.nativeElement.value = null;
        });
    }
  }

  private initProductForm(): void {
    this.productForm = this.formBuilder.group({
      category_id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
    });
  }

  private initCategories(): void {
    this.categoriesService.getCategories$().subscribe(categories => {
      this.categories = categories.data;
      this.cdr.markForCheck();
    });
  }
}
