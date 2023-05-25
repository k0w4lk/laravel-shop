import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, combineLatest, debounceTime, of, switchMap } from 'rxjs';
import { HeaderComponent } from '../../core/components/header/header.component';
import { PaginationComponent } from '../../core/components/pagination/pagination.component';
import { ProductCardComponent } from '../../core/components/product-card/product-card.component';
import { Category } from '../../core/configs/interfaces/category.interface';
import { Pagination } from '../../core/configs/interfaces/pagination.interface';
import { Product } from '../../core/configs/interfaces/products.interface';
import { UserDtoIn } from '../../core/configs/interfaces/user.interface';
import { CategoriesService } from '../../core/services/categories.service';
import { ProductsService } from '../../core/services/products.service';
import { QueryParamsService } from '../../core/services/query-params.service';
import { UserService } from '../../core/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    PaginationComponent,
    ProductCardComponent,
    ReactiveFormsModule,
  ],
  providers: [QueryParamsService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  public nameSearchControl = new FormControl<string>('');
  public priceFromControl = new FormControl<number | null>(null);
  public priceToControl = new FormControl<number | null>(null);
  public myProductsActive = new FormControl<boolean>(false);
  public categoriesForm: FormGroup;
  public createProductVisible = false;
  public user: UserDtoIn;
  public products: Product[] = [];
  public categories: Category[] = [];
  public pagination: Pagination;
  public totalProductsAmount: number;

  constructor(
    private categoriesService: CategoriesService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private queryParamsService: QueryParamsService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.initProductsData();
    this.watchFilterControls();
    this.watchQueryParamsUpdate();
    this.initCategoriesForm();
    this.initCategories();

    this.userService.user$.pipe(untilDestroyed(this)).subscribe(user => {
      this.user = user;
      this.cdRef.markForCheck();
    });

    this.myProductsActive.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(owner => {
        // this.paginator.firstPage();

        if (owner) {
          this.queryParamsService.setQueryParams({
            owner,
            page: 1,
          });
        } else {
          this.queryParamsService.deleteQueryParams(['owner']);
        }
      });
  }

  public updateProductsList(): void {
    this.productsService
      .getProducts$(this.queryParamsService.buildQueryString())
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.totalProductsAmount = res.pagination.totalCount;
        if (!res.data.length) {
          // this.paginator.previousPage();
        }
        this.cdRef.markForCheck();
      });
  }

  public deleteProduct(id: number): void {
    this.productsService
      .deleteProduct$(id)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.updateProductsList();
      });
  }

  public sortChanged(event: any) {
    // this.paginator.firstPage();

    this.queryParamsService.setQueryParams({
      sortBy: event.active,
      sortOrder: event.direction,
    });
  }

  public paginate(page: number): void {
    this.queryParamsService.setQueryParams({ page: page });
  }

  private initProductsData(): void {
    this.queryParamsService.setQueryParams({ page: 1 });
  }

  private watchFilterControls(): void {
    this.nameSearchControl.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(value => {
        if (value) {
          this.queryParamsService.setQueryParams({
            searchField: 'name',
            searchValue: value,
            page: 1,
          });
        } else {
          this.queryParamsService.deleteQueryParams([
            'searchField',
            'searchValue',
          ]);
        }
      });

    this.priceFromControl.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(value => {
        // this.paginator.firstPage();

        if (Number.isFinite(value)) {
          this.queryParamsService.setQueryParams({
            'price[from]': value,
          });
        } else {
          this.queryParamsService.deleteQueryParams(['price[from]']);
        }
      });

    this.priceToControl.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(value => {
        // this.paginator.firstPage();

        if (Number.isFinite(value)) {
          this.queryParamsService.setQueryParams({
            'price[to]': value,
          });
        } else {
          this.queryParamsService.deleteQueryParams(['price[to]']);
        }
      });
  }

  private watchQueryParamsUpdate(): void {
    this.queryParamsService.queryParams$
      .pipe(
        switchMap(() =>
          this.productsService
            .getProducts$(this.queryParamsService.buildQueryString())
            .pipe(catchError(() => of(null)))
        ),
        untilDestroyed(this)
      )
      .subscribe(res => {
        if (res) {
          this.pagination = res.pagination;
          this.totalProductsAmount = res.pagination.totalCount;
          this.products = res.data;
          this.cdRef.markForCheck();
        }
      });
  }

  private initCategories(): void {
    combineLatest([
      this.categoriesService.getCategories$(),
      this.route.queryParamMap,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([res, queryParams]) => {
        this.categories = res.data;
        this.categories.forEach(category => {
          const controlValue = +queryParams.get('category') === category.id;

          (this.categoriesForm.get('checkboxes') as FormArray).push(
            this.fb.control(controlValue),
            { emitEvent: controlValue }
          );
        });
        this.cdRef.markForCheck();
      });
  }

  private initCategoriesForm(): void {
    this.categoriesForm = this.fb.group({
      checkboxes: this.fb.array([]),
    });

    this.categoriesForm
      .get('checkboxes')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        const categoryIds: number[] = [];

        value.forEach((checked: boolean, index: number) => {
          if (checked) {
            categoryIds.push(this.categories[index].id);
          }
        });

        if (categoryIds.length) {
          this.queryParamsService.setQueryParams({
            'category_id[]': categoryIds,
          });
        } else {
          this.queryParamsService.deleteQueryParams(['category_id[]']);
        }
      });
  }
}
