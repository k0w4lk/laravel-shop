import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, debounceTime, filter, of, switchMap } from 'rxjs';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { QueryParamsService } from '../../../../core/services/query-params.service';
import { UserDtoIn } from '../../../../core/configs/interfaces/user.interface';
import { ProductsService } from '../../../../core/services/products.service';
import { UserService } from '../../../../core/services/user.service';
import { Product } from '../../../../core/configs/interfaces/products.interface';
import { DEFAULT_PAGE_SIZE } from '../../../../core/configs/constants/page-size';

@UntilDestroy()
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    CreateProductComponent,
    EditProductComponent,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  providers: [QueryParamsService],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public productsDataSource = new MatTableDataSource<Product>([]);
  public nameSearchControl = new FormControl<string>('');
  public priceFromControl = new FormControl<number | null>(null);
  public priceToControl = new FormControl<number | null>(null);
  public myProductsActive = new FormControl<boolean>(false);
  public createProductVisible = false;
  public editProductDialogRef: MatDialogRef<EditProductComponent>;
  public user: UserDtoIn;
  public defaultPageSize = DEFAULT_PAGE_SIZE;
  public totalProductsAmount: number;

  public displayedColumns: string[] = ['name', 'price', 'categoryName'];

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private productsService: ProductsService,
    private queryParamsService: QueryParamsService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.initProductsData();
    this.watchFilterControls();
    this.watchQueryParamsUpdate();
    this.manageForbiddenParts();

    this.userService.user$.pipe(untilDestroyed(this)).subscribe(user => {
      this.user = user;
      this.cdRef.markForCheck();
    });

    this.myProductsActive.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(owner => {
        this.paginator.firstPage();

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

  public ngAfterViewInit(): void {
    this.paginate();
  }

  public updateProductsList(): void {
    this.productsService
      .getProducts$(this.queryParamsService.buildQueryString())
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.totalProductsAmount = res.pagination.totalCount;
        this.productsDataSource = new MatTableDataSource(res.data);
        if (!res.data.length) {
          this.paginator.previousPage();
        }
        this.cdRef.markForCheck();
      });
  }

  public editProduct(id: number): void {
    this.editProductDialogRef = this.dialog.open(EditProductComponent, {
      data: {
        id,
      },
    });

    this.editProductDialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.updateProductsList();
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
    this.paginator.firstPage();

    this.queryParamsService.setQueryParams({
      sortBy: event.active,
      sortOrder: event.direction,
    });
  }

  private initProductsData(): void {
    this.queryParamsService.setQueryParams({ page: 1 });
  }

  private watchFilterControls(): void {
    this.nameSearchControl.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(value => {
        this.paginator.firstPage();

        if (value) {
          this.queryParamsService.setQueryParams({
            searchField: 'name',
            searchValue: value,
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
        this.paginator.firstPage();

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
        this.paginator.firstPage();

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
          this.totalProductsAmount = res.pagination.totalCount;
          this.productsDataSource = new MatTableDataSource(res.data);
          this.cdRef.markForCheck();
        }
      });
  }

  private paginate(): void {
    this.productsDataSource.paginator = this.paginator;

    this.paginator.page.pipe(untilDestroyed(this)).subscribe(pageEvent => {
      this.queryParamsService.setQueryParams({ page: pageEvent.pageIndex + 1 });
    });
  }

  private manageForbiddenParts(): void {
    if (this.userService.checkUserRoles(['super-admin', 'admin', 'manager'])) {
      this.displayedColumns.push('actions');
      this.createProductVisible = true;
    }
  }
}
