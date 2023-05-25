import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, switchMap } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';
import { QueryParamsService } from '../../core/services/query-params.service';
import { UserService } from '../../core/services/user.service';
import { CreateCategoryComponent } from '../managing/components/categories/components/create-category/create-category.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { Category } from '../../core/configs/interfaces/category.interface';
import { HeaderComponent } from '../../core/components/header/header.component';
import { RouterLink } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    CategoryCardComponent,
    CreateCategoryComponent,
    HeaderComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  providers: [QueryParamsService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  public nameSearchControl = new FormControl<string>('');
  public totalCategoriesAmount: number;
  public displayedColumns: string[] = ['name'];
  public createCategoryVisible = false;
  public categories: Category[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private categoriesService: CategoriesService,
    private queryParamsService: QueryParamsService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.initCategoriesData();
    this.watchFilterControls();
    this.watchQueryParamsUpdate();
    this.manageForbiddenParts();
  }

  public updateCategoriesList(): void {
    this.categoriesService
      .getCategories$(this.queryParamsService.buildQueryString())
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.totalCategoriesAmount = res.pagination.totalCount;
        if (!res.data.length) {
          // this.paginator.previousPage();
        }
        this.cdRef.markForCheck();
      });
  }

  public deleteCategory(id: number): void {
    this.categoriesService
      .deleteCategory$(id)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.updateCategoriesList();
      });
  }

  private initCategoriesData(): void {
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
          });
        } else {
          this.queryParamsService.deleteQueryParams([
            'searchField',
            'searchValue',
          ]);
        }
      });
  }

  private watchQueryParamsUpdate(): void {
    this.queryParamsService.queryParams$
      .pipe(
        untilDestroyed(this),
        switchMap(() =>
          this.categoriesService.getCategories$(
            this.queryParamsService.buildQueryString()
          )
        )
      )
      .subscribe(res => {
        this.categories = [...res.data];
        this.totalCategoriesAmount = res.pagination.totalCount;
        this.cdRef.markForCheck();
      });
  }

  // private paginate(): void {
  //   this.categoriesDataSource.paginator = this.paginator;

  //   this.paginator.page.pipe(untilDestroyed(this)).subscribe(pageEvent => {
  //     this.queryParamsService.setQueryParams({ page: pageEvent.pageIndex + 1 });
  //   });
  // }

  private manageForbiddenParts(): void {
    if (this.userService.checkUserRoles(['super-admin', 'admin'])) {
      this.displayedColumns.push('actions');
      this.createCategoryVisible = true;
    }
  }
}
