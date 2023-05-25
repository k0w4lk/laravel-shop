import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, switchMap } from 'rxjs';
import { HeaderComponent } from '../../core/components/header/header.component';
import { Product } from '../../core/configs/interfaces/products.interface';
import { FeedbackService } from '../../core/services/feedback.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductsService } from '../../core/services/products.service';
import { UserService } from '../../core/services/user.service';
import { PaginationComponent } from '../../core/components/pagination/pagination.component';
import { Pagination } from '../../core/configs/interfaces/pagination.interface';
import { QueryParamsService } from '../../core/services/query-params.service';

type ProductTab = 'feedback' | 'description';

@UntilDestroy()
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    PaginationComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [QueryParamsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent implements OnInit {
  public product: Product;
  public productId: number;
  public reviewsPagination: Pagination;
  public feedbackForm: FormGroup;
  public reviews: any;
  public selectedTab: ProductTab = 'description';

  constructor(
    public userService: UserService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private notificationService: NotificationService,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private queryParamsService: QueryParamsService
  ) {}

  public ngOnInit(): void {
    this.initFeedbackForm();
    this.initProduct();

    this.queryParamsService.queryParams$
      .pipe(
        filter(Boolean),
        untilDestroyed(this),
        switchMap(() =>
          this.productService.getProductReviews$(
            this.route.snapshot.params['id'],
            this.queryParamsService.buildQueryString()
          )
        )
      )
      .subscribe(reviews => {
        this.reviews = reviews.data;
        this.reviewsPagination = reviews.pagination;
        this.cdRef.markForCheck();
        this.cdRef.markForCheck();
      });
  }

  public sendFeedback(): void {
    if (this.feedbackForm.valid) {
      const feedback = this.feedbackForm.getRawValue();
      this.userService.user$
        .pipe(
          untilDestroyed(this),
          switchMap(user => {
            feedback['email'] = user.email;
            feedback['user_id'] = user.id;
            feedback['product_id'] = this.product.id;
            return this.feedbackService.sendFeedback$(feedback);
          })
        )
        .subscribe(() => {
          this.notificationService.show({
            message: 'Your feedback was sent',
            status: 'success',
          });
        });
    }
  }

  public selectTab(tab: ProductTab): void {
    this.selectedTab = tab;

    if (this.selectedTab === 'feedback' && !this.reviews) {
      this.initReviews();
    }
  }

  public changeReviewsPage(page: number): void {
    this.queryParamsService.setQueryParams({
      page,
    });
  }

  private initFeedbackForm(): void {
    this.feedbackForm = this.fb.group({
      rating: [5, [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  private initProduct(): void {
    this.route.paramMap
      .pipe(
        untilDestroyed(this),
        map(params => params.get('id')),
        switchMap(id => this.productService.getProduct$(+id))
      )
      .subscribe(product => {
        this.product = product;
        this.cdRef.markForCheck();
      });
  }

  private initReviews(): void {
    this.queryParamsService.setQueryParams({ page: 1 });
  }
}
