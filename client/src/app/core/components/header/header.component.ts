import { Dialog } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserDtoIn } from '../../configs/interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ButtonComponent } from '../button/button.component';
import { AuthComponent } from '../dialogs/auth/auth.component';

@UntilDestroy()
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    OverlayModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public user: UserDtoIn;
  public userMenuOpened = false;

  constructor(
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private dialog: Dialog,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.userService.user$.pipe(untilDestroyed(this)).subscribe(user => {
      this.user = user;
      this.cdRef.markForCheck();
    });
  }

  public openLoginDialog(): void {
    this.dialog.open<string>(AuthComponent);
    this.userMenuOpened = false;
  }

  public logOut(): void {
    this.authService
      .logout$()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        sessionStorage.removeItem('user-access-token');
        this.user = null;
        this.userMenuOpened = false;

        if (this.route.snapshot.routeConfig.path === 'managing') {
          this.router.navigate(['/']);
        }

        this.cdRef.markForCheck();
      });
  }
}
