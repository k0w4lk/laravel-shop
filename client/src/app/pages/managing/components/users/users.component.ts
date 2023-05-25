import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ButtonComponent } from '../../../../core/components/button/button.component';
import { Role } from '../../../../core/configs/interfaces/role.interface';
import { UserDtoIn } from '../../../../core/configs/interfaces/user.interface';
import { RolesService } from '../../../../core/services/roles.service';
import { UserService } from '../../../../core/services/user.service';
import { EditRoleComponent } from './components/edit-role/edit-role.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DEFAULT_PAGE_SIZE } from '../../../../core/configs/constants/page-size';
import { QueryParamsService } from '../../../../core/services/query-params.service';
import { catchError, of, switchMap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QueryParamsService],
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public usersDataSource = new MatTableDataSource<UserDtoIn>([]);
  public totalUsersAmount: number;
  public createUserForm: FormGroup;
  public displayedColumns: string[] = ['name', 'email', 'role', 'actions'];
  public roles: Role[] = [];
  public defaultPageSize = DEFAULT_PAGE_SIZE;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialogService: MatDialog,
    private fb: FormBuilder,
    private rolesService: RolesService,
    private queryParamsService: QueryParamsService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.initUsers();
    this.initRoles();
    this.initCreateUserForm();
    this.watchQueryParamsUpdate();
  }

  public ngAfterViewInit(): void {
    this.paginate();
  }

  public createUser(): void {
    if (this.createUserForm.valid) {
      const formData = this.createUserForm.getRawValue();

      const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role_id: formData.role.id,
      };

      this.userService
        .createUser$(body)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.createUserForm.reset();
          this.updateProductsList();
        });
    }
  }

  public editRole(userId: number): void {
    this.dialogService
      .open(EditRoleComponent, {
        data: { roles: this.roles, userId },
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.updateProductsList();
      });
  }

  private updateProductsList(): void {
    this.userService
      .getUsers$(this.queryParamsService.buildQueryString())
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.totalUsersAmount = res.pagination.totalCount;
        if (Array.isArray(res.data)) {
          this.usersDataSource = new MatTableDataSource(res.data);
          if (!res.data.length) {
            this.paginator.previousPage();
          }
        }
        this.cdRef.markForCheck();
      });
  }

  private initRoles(): void {
    this.rolesService
      .getRoles$()
      .pipe(untilDestroyed(this))
      .subscribe(roles => {
        this.roles = roles;

        const userRole = this.roles.find(role => role.slug === 'user');

        if (userRole) {
          this.createUserForm
            .get('role')
            .setValue(userRole, { emitEvent: false });
        }
      });
  }

  private initUsers(): void {
    this.queryParamsService.setQueryParams({ page: 1 });
  }

  private initCreateUserForm(): void {
    this.createUserForm = this.fb.group({
      name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  private watchQueryParamsUpdate(): void {
    this.queryParamsService.queryParams$
      .pipe(
        switchMap(() =>
          this.userService
            .getUsers$(this.queryParamsService.buildQueryString())
            .pipe(catchError(() => of(null)))
        ),
        untilDestroyed(this)
      )
      .subscribe(res => {
        if (res) {
          this.totalUsersAmount = res.pagination.totalCount;
          if (Array.isArray(res.data)) {
            this.usersDataSource = new MatTableDataSource(res.data);
          }
          this.cdRef.markForCheck();
        }
      });
  }

  private paginate(): void {
    this.usersDataSource.paginator = this.paginator;

    this.paginator.page.pipe(untilDestroyed(this)).subscribe(pageEvent => {
      this.queryParamsService.setQueryParams({ page: pageEvent.pageIndex + 1 });
    });
  }
}
